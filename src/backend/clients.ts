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
        this.emit('close', this, code, reason)
    }

    private _handle_error(err:Error) :void{
        console.error('Websocket error',err)
        this.emit('error', this, err)
    }

    public close(code?:number, reason?:string){
        this._ws.close(code, reason)
    }

    public get socket() :ws{
        return this._ws
    }
}


export class ClientManager extends EventEmitter {

    private _server:Server
    private _frontend_cons: FrontendConnection[] = []

    constructor(server: Server){
        super()
        this._server = server
        this._server.on('client-connected', (ws) => this._connect_ws(ws))
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

        this.sendCommand('syncsongs', {name: 'test', source: 'yt', uuid: 'id', requester:'me', url: 'google.com'}) //TODO: This is just a test remove later
    }

    public closeAll(): void {
        for(const con of this._frontend_cons){
            con.close()
        }
        this._frontend_cons = []
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

    public sendCommand(command: string, ...args:any[]){
        let msg = JSON.stringify({command, args})
        for(let con of this._frontend_cons){
            con.socket.send(msg)
        }
    }
}