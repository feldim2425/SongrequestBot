import express from 'express'
import expressWs from 'express-ws'
import {EventEmitter} from 'events'
import path from 'path'
import * as _ from 'lodash'
import http, {Server as httpServer} from 'http'
import https, {Server as httpsServer} from 'https'
import {StateException} from '../utils/errors'
import ws from 'ws'
import {promises as fsp} from 'fs'

type HttpsData = {
    ca?: Buffer,
    cert: Buffer | undefined,
    key: Buffer | undefined,
    https: boolean
}

function redirectDashboard(req: express.Request|undefined, res: express.Response) : void{
    res.redirect('/dashboard')
}

function isHttpsConfigured(_serverConfig: ServerConfiguration): boolean{
    return ('https' in _serverConfig) && !_.isEmpty(_serverConfig.https.cert) && !_.isEmpty(_serverConfig.https.key)
}

async function loadCertificates(_serverConfig: ServerConfiguration): Promise<HttpsData>{
    let data:HttpsData = {cert: undefined, key: undefined, https: false}
    if(!isHttpsConfigured(_serverConfig)){
        return data
    }

    data.https = true

    let certPromise = fsp.readFile(_serverConfig.https.cert)
    let keyPromise = fsp.readFile(_serverConfig.https.key)
    let caPromise: Promise<Buffer> = undefined
    if(!_.isEmpty(_serverConfig.https.ca)){
        caPromise =  fsp.readFile(_serverConfig.https.ca)
    }
    
    data.cert = await certPromise
    data.key = await keyPromise
    if(caPromise !== undefined){
        data.ca = await caPromise
    }
    return data
}

const FILE_MAPPINGS : {[key:string]: string} = {
    '/dashboard': 'view.html',
    '/frontend.js': 'frontend.js'
}

export type ServerConfiguration = {
    enable_https?: boolean,
    dashboard_sha256?: string,
    https?: {
        ca?: string,
        cert?: string,
        key?: string
    }
}

/**
 * Server states
 */
export enum ServerState {
    /**
     * Server is not running
     */
    STOPPED,
    /**
     * Server is currently in the process of starting. <br>
     * Stopping is not possible at this stage
     */
    STARTING,
    /**
     * The server has started and is listening for connections
     */
    STARTED,
    /**
     * The server is currently shutting down. <br>
     * Restarting is not possible at this stage
     */
    STOPPING
}

/**
 * Handles the express server and the connected clients
 */
export default class Server extends EventEmitter{

    private _expApp: expressWs.Application | undefined
    private _expWs: expressWs.Instance | undefined
    private _server?: httpServer | httpsServer | undefined
    private _resourcePath: string
    private _state: ServerState = ServerState.STOPPED
    private _restarting: boolean = false
    private _port:number
    private _serverConfig: ServerConfiguration | undefined = undefined
    
    constructor(resourcePath: string){
        super()
        this._resourcePath = path.resolve(resourcePath)
    }

    private _sendAudioStream(req: express.Request, res: express.Response){
        console.warn('Audiostream tried to connect! But this feature isn\'t implemented yet!')
        res.status(501).send('The audio stream isn\'t implementet yet. Soon&trade;')
        // TODO Implement real time audio stream to playback the bots audio from the browser
        //res.status(200).header('Content-Type', 'audio/mpeg')
    }

    private _setState(state: ServerState){
        this._state = state
        this.emit('state', state)
    }

    private async _initializeExpress(){
        let httpsData =  await loadCertificates(this._serverConfig)
        
        this._expApp = (<expressWs.Application> <unknown>express())
        if(httpsData.https){
            this._server = https.createServer({
                ca: httpsData.ca,
                key: httpsData.key,
                cert: httpsData.cert
            }, this._expApp)
        }
        else {
            this._server = http.createServer(this._expApp)
        }
        this._expWs = expressWs(this._expApp, this._server)

        for(const [route, file] of Object.entries(FILE_MAPPINGS)){
            this._expApp.get(route, (req: express.Request, res: express.Response) => res.sendFile(path.join(this._resourcePath, file)))
        }

        this._expApp.get('/audio', (req, res) => this._sendAudioStream(req, res))
        this._expApp.ws('/socket', (ws, req) => this.emit('client_connected', ws, req))
        this._expApp.use(redirectDashboard);
        
    }

    private async _initializeServer(){
        switch(this._state){
            case ServerState.STARTED:
                // Server is up. stop it and wait for the Stopped or Stopping state
                console.log('Reinitializing Server...')
                this._restarting = true
                this.once('state', () => this._initializeServer())
                this.stopServer()
                break
            case ServerState.STOPPING:
            case ServerState.STARTING:
                // The Server is in the process of starting or stopping. 
                // Either way we have to wait until the process finished to do something like stopping it
                this.once('state', () => this._initializeServer())
                break
            case ServerState.STOPPED:
                await this._initializeExpress()
                if(this._restarting){
                    this._restarting = false
                    this.startServer(this._port)
                }
        }
    }

    /**
     * Updates the server configuration and restarts the server if it was started before or scheduled to start.
     * It also avoids unnecessary updates when the config didn't change. This method has to be called at least once
     * in order for the server to start. This is a security measure to prevent the server from starting in http or without password
     * when configured otherwise. Since this function avoids unnecessary updates it can be called directly when the config updates.
     * @param {ServerConfiguration} config new Server configuration
     */
    public updateServerConfiguration(config : ServerConfiguration){
        const newConf = _.defaultsDeep({}, config, Server.defaultConfig)
        if(_.isNil(this._server) || _.isNil(this._serverConfig) || !_.isEqual(this._serverConfig, newConf)){
            this._serverConfig = newConf
            this._initializeServer()
        }
    }

    /**
     * Start the server on the given port. 
     * @param {number} port server port defailts to 8880
     * 
     * @throws StateException if the server is already open
     */
    public startServer(port: number = 8880){
        if(this.state !== ServerState.STOPPED){
            throw new StateException('Server already open')
        }

        this._port = port
        if(_.isNil(this._server)){
            console.log('Server start waiting for initialization')
            this._restarting = true
            return
        }

        this._setState(ServerState.STARTING)

        this._server.listen(port)
        this._server.once('listening', () => {
            console.log(`Server listening on port '${port}'`)
            this._setState(ServerState.STARTED)
        });
    }

    /**
     * Stops the server
     */
    public stopServer() : void{
        if(this.state === ServerState.STARTED) {
            this._setState(ServerState.STOPPING)
            this._server.close(() => {
                this._setState(ServerState.STOPPED)
            })
        }
    }

    /**
     * @return the current server state
     */
    public get state() : ServerState {
        return this._state
    }
    
    /**
     * @return the servers resource path (the directory for file serving)
     */
    public get resources() : string {
        return this._resourcePath
    }

    public serveAudioStream(stream: NodeJS.WritableStream) : void {

    }

    public static get defaultConfig(): ServerConfiguration{
        return {
            'enable_https':false,
            'dashboard_sha256': null,
            'https': {
                'ca': '',
                'cert': '',
                'key': ''
            }
        }
    }
}

