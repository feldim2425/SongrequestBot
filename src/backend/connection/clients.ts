import Server from './server'
import ws from 'ws'
import { EventEmitter } from 'events'
import _ from 'lodash'

/**
 * This Class is not stricly necessary, but it makes it more futureproof incase per client data becomes a thing we need.
 * Like login, sessions, per client settings or this kind of stuff
 */
export class FrontendConnection extends EventEmitter{
    private _ws: ws

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
}

/**
 * Manages all client connections (connecting, errors, messages and disconnects)
 * and relays messages to the clients
 */
export class ClientManager extends EventEmitter {
    private _server:Server
    private _frontend_cons: FrontendConnection[] = []

    constructor(server: Server){
        super()
        this._server = server
        this._server.on('client_connected', (ws) => this._connect_ws(ws))
        this._server.on('stopping', () => this.closeAll())
    }

    private _connect_ws(ws: ws) : void{
        const con = new FrontendConnection(ws)
        this._frontend_cons.push(con)
        con.on('message', (message) => this._parseMessage(message))
        con.on('close', () => {
            _.remove(this._frontend_cons, (listCon) => listCon === con)
        })
        console.info('Client connected')

        this.emit('new_client', con)
    }

    private _parseMessage(message: MessageEvent): void {
        if(!_.isString(message.data)){
            return
        }
        let command : string = undefined
        let args : any[] = []
        try{
            let msgObj = JSON.parse(message.data)
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
            this.emit('command', command, args)
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
     * Sends a command to all clients
     * @param command Command to execute
     * @param args Arguments
     */
    public sendCommand(command: string, ...args:any[]) : void{
        let msg = JSON.stringify({command, args})
        for(let con of this._frontend_cons){
            con.socket.send(msg)
        }
    }
}