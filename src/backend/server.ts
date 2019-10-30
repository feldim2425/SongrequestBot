import express from 'express'
import expressWs from 'express-ws'
import {EventEmitter} from 'events'
import path from 'path'
import * as _ from 'lodash'
import {Server as httpServer} from 'http'
import {StateException} from './utils/errors'
import ws from 'ws'

function _redirectDashboard(req: express.Request|undefined, res: express.Response) : void{
    res.redirect('/dashboard')
}

function _backendHandler(ws: ws, req: express.Request, next: express.NextFunction) : void {
    next()
}


const FILE_MAPPINGS : {[key:string]: string} = {
    '/dashboard': 'view.html',
    '/frontend.js': 'frontend.js'
}

export default class Server extends EventEmitter{

    private _expApp: express.Application | expressWs.Application
    private _expWs: expressWs.Instance
    private _resourcePath: string
    private _server?: httpServer
    private _open: boolean = false


    constructor(resourcePath: string){
        super()
        this._expApp = express()
        this._expWs = expressWs(this._expApp)
        this._resourcePath = path.resolve(resourcePath)

        for(const [route, file] of Object.entries(FILE_MAPPINGS)){
            this._expApp.get(route, (req: express.Request, res: express.Response) => res.sendFile(path.join(this._resourcePath, file)))
        }
        (<expressWs.Application> this._expApp).ws('/socket',_backendHandler)

        this._expApp.use(_redirectDashboard);
    }

    public startServer(port: number = 8880) : void{
        if(this.serverOpen){
            throw new StateException('Server already open')
        }

        if(_.isNil(this._server)) {
            this._server = this._expApp.listen(port)
        }
        else {
            this._server.listen(port)
        }
        this._server.once('listening', () => {this._open = true});
        console.log(`Server lisening on port '${port}'`)
        this.emit('started', port)
    }

    public stopServer() : void{
        if(this.serverOpen) {
            this._server.close(() => {this._open = false})
        }
    }

    public get serverOpen() : boolean{
        return this._open && !_.isNil(this._server)
    }

    public get resources() : string{
        return this._resourcePath
    }
}
