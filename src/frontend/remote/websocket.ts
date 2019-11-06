import {EventEmitter} from 'events'
import _ from "lodash";

function _getUrl(endpoint: string) : string{
    const loc = window.location
    var url = ''
    if(loc.protocol === 'https:'){
        url += 'wss://'
    }
    else {
        url += 'ws://'
    }

    if(endpoint.startsWith('//')){
        url += endpoint.substr(2)
    }
    else if(endpoint.startsWith('/')){
        url += loc.host + endpoint
    }
    else {
        url += loc.host + loc.pathname + endpoint
    }

    return url
}

export default class BackendConnection extends EventEmitter {
    
    private _socket?: WebSocket
    
    public connect(): void{
        if(!this.open){
            this._socket = new WebSocket(_getUrl('/socket'))
            this._socket.onopen = () => this.emit('connected')
            this._socket.onclose = () => this.emit('closed')
            this._socket.onerror = (event)  => this.emit('error', event)
            this._socket.onmessage = (message) => this._parseMessage(message)
        }
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

    public disconnect(): void{
        if(this.open){
            this._socket.close()
        }
    }

    public get open(){
        return !_.isNil(this._socket) && this._socket.readyState == WebSocket.OPEN
    }

    public sendCommand(command: string, ...args:any[]){
        if(this.open){
            let msg = JSON.stringify({command, args})
            this._socket.send(msg)
        }
    }
}