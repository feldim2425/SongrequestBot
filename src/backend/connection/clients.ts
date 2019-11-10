import Server from './server'
import ws from 'ws'
import { EventEmitter } from 'events'
import _ from 'lodash'
import { ConfigHandler } from '../config/config'
import { OMIT_CLIENT_CONFIG } from '../constants'
import uuid from 'uuid'

/**
 * This Class is not stricly necessary, but it makes it more futureproof incase per client data becomes a thing we need.
 * Like login, sessions, per client settings or this kind of stuff
 */
export class FrontendConnection extends EventEmitter{
    private _ws: ws
    private _auth: boolean = false

    constructor(ws :ws){
        super()
        this._ws = ws
        ws.on('close', (code, reason) => this._handle_close(code, reason))
        ws.on('error', (err) => this._handle_error(err) )
        ws.on('message', (message) => this.emit('message', message))
    }

    private _handle_close(code:number, reason:string) :void{
        console.info(`Client disconnected: <${code}> "${reason}"`)
        this.emit('close', code, reason)
    }

    private _handle_error(err:Error) :void{
        console.error('Websocket error',err)
        this.emit('error', err)
    }

    /**
     * Close the client connection
     * 
     * @param {number} code Websocket disconnect code (default: 1000)
     * @param {string} reason Disconnect reason (default: '')
     */
    public close(code?:number, reason?:string){
        this._ws.close(code, reason)
    }

    /**
     * Sends a command to the client
     * @param command Command to execute
     * @param args Arguments
     */
    public sendCommand(command: string, ...args:any[]){
        let msg = JSON.stringify({command, args})
        this._ws.send(msg)
    }

    /**
     * @return The websocket instance
     */
    public get socket() :ws{
        return this._ws
    }

    public get authenticated():boolean{
        return this._auth
    }

    public set authenticated(value: boolean){
        if(this._auth === value){
            return
        }
        this._auth = value
        if(value){
            this.sendCommand('login_ok')
            this.emit('login')
        }
        else {
            this.sendCommand('login_required')
            this.emit('logout')
        }
        
    }
}

/**
 * Manages all client connections (connecting, errors, messages and disconnects)
 * and relays messages to the clients
 */
export class ClientManager extends EventEmitter {
    private _server: Server
    private _config: ConfigHandler
    private _frontend_cons: FrontendConnection[] = []

    constructor(server: Server, config: ConfigHandler){
        super()
        this._server = server
        this._config = config
        this._server.on('client_connected', (ws) => this._connect_ws(ws))
        this._server.on('stopping', () => this.closeAll())
        
        this._config.on('update_config', (oldC, newC) => this.sendCommand('update_config', _.omit(newC, OMIT_CLIENT_CONFIG)))
    }

    private _connect_ws(ws: ws) : void{
        const con = new FrontendConnection(ws)
        this._frontend_cons.push(con)
        con.on('message', (message) => this._parseMessage(message, con))
        con.on('close', () => {
            _.remove(this._frontend_cons, (listCon) => listCon === con)
        })

        con.on('login', () => {
            con.sendCommand('update_config', _.omit(this._config.configuration, OMIT_CLIENT_CONFIG))
            con.sendCommand('sync_msgs',[
                {id:uuid(), title:"Unknown", message:"This is a test", type: 0},
                {id:uuid(), title:"Info", message:"This is a test", type: 1},
                {id:uuid(), title:"Warning", message:"This is a test", type: 2},
                {id:uuid(), title:"Error", message:"This is a test", type: 3}
            ])
        })

        if(_.isEmpty(this._config.configuration['server']['dashboard_sha256'])){
            con.authenticated = true
        }
        else {
            con.sendCommand('login_required')
        }
        
        console.info('Client connected')
        this.emit('new_client', con)
    }

    private _parseMessage(message: ws.Data, con: FrontendConnection): void {
        if(!_.isString(message)){
            return
        }
        let command : string = undefined
        let args : any[] = []
        try{
            let msgObj = JSON.parse(message)
            if(!_.isObject(msgObj) || !msgObj.hasOwnProperty('command') || !_.isString(msgObj['command'])){
                return
            }
            command = msgObj['command']
            if(msgObj.hasOwnProperty('args') && _.isArray(msgObj['args'])){
                args = msgObj['args']
            }
        } 
        catch(e){
            // Nothing ... In case of an error the message was probably wrong
        }

        if(!_.isNil(command)){
            this.emit('command', con, command, args)
        }
    }

    /**
     * Closes all connections
     */
    public closeAll(): void {
        for(const con of this._frontend_cons){
            con.close(1000, 'closed')
        }
        this._frontend_cons = []
    }

    /**
     * @returns a list of all clients
     */
    get clients(): FrontendConnection[]{
        return [...this._frontend_cons]
    }

    /**
     * @returns a list of all authenticated clients
     */
    get loggedInClients(): FrontendConnection[]{
        return this._frontend_cons.filter((val, index, arr) => val.authenticated)
    }

    /**
     * Sends a command to all clients
     * @param command Command to execute
     * @param args Arguments
     */
    public sendCommand(command: string, ...args:any[]) : void{
        let msg = JSON.stringify({command, args})
        for(let con of this._frontend_cons){
            if(con.authenticated){
                con.socket.send(msg)
            }
        }
    }
}