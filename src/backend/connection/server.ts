import express from 'express'
import expressWs from 'express-ws'
import {EventEmitter} from 'events'
import path from 'path'
import * as _ from 'lodash'
import {Server as httpServer} from 'http'
import {StateException} from '../utils/errors'
import ws from 'ws'

function _redirectDashboard(req: express.Request|undefined, res: express.Response) : void{
    res.redirect('/dashboard')
}

const FILE_MAPPINGS : {[key:string]: string} = {
    '/dashboard': 'view.html',
    '/frontend.js': 'frontend.js'
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

    private _expApp: express.Application | expressWs.Application
    private _expWs: expressWs.Instance
    private _resourcePath: string
    private _server?: httpServer
    private _state: ServerState = ServerState.STOPPED
    
    constructor(resourcePath: string){
        super()
        this._expApp = express()
        this._expWs = expressWs(this._expApp)
        this._resourcePath = path.resolve(resourcePath)

        for(const [route, file] of Object.entries(FILE_MAPPINGS)){
            this._expApp.get(route, (req: express.Request, res: express.Response) => res.sendFile(path.join(this._resourcePath, file)))
        }
        (<expressWs.Application> this._expApp).ws('/socket', (ws, req) => this.emit('client-connected', ws, req))

        this._expApp.use(_redirectDashboard);
    }

    /**
     * Start the server on the given port. 
     * @param {number} port server port defailts to 8880
     * 
     * @throws StateException if the server is already open
     */
    public startServer(port: number = 8880) : void{
        if(this.state == ServerState.STOPPED){
            throw new StateException('Server already open')
        }

        this._state = ServerState.STARTING
        this.emit('starting')

        if(_.isNil(this._server)) {
            this._server = this._expApp.listen(port)
        }
        else {
            this._server.listen(port)
        }
        this._server.once('listening', () => {
            this._state = ServerState.STARTED
            console.log(`Server lisening on port '${port}'`)
            this.emit('started', port)
        });
    }

    /**
     * Stops the server
     */
    public stopServer() : void{
        if(this.state == ServerState.STARTED) {
            this._state = ServerState.STOPPING
            this.emit('stopping')
            this._server.close(() => {
                this._state = ServerState.STOPPED
                this.emit('stopped')
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
    public get resources() : string{
        return this._resourcePath
    }
}

