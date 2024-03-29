import { EventEmitter } from 'events';
import { ClientManager } from '../connection/clients'
import _ from 'lodash';


export interface AccountService {

    readonly enabled: boolean
    readonly loggedin: boolean

    registered(manager: ServiceManager)

    configure(config: object)
}

type ServicesDict = {[name: string]: AccountService}

export default class ServiceManager {

    private _services: ServicesDict = {}
    private _config: object|undefined = undefined
    private _clients: ClientManager;

    constructor(clients: ClientManager){
        this._clients = clients
    }

    public registerService(name: string, service: AccountService): boolean{
        if(this._services.hasOwnProperty(name)){
            return false
        }
        this._services[name] = service
        service.registered(this)
        if(!_.isNil(this._config)){
            service.configure(this._config)
        }
        console.log(`Service "${name}" registered`)
    }

    public updateConfiguration(config: object){
        if(_.isEqual(config, this._config)){
            return
        }
        console.log(`${_.isEmpty(this._config)? 'Configuring' : 'Reconfiguring'} services...`) 
        this._config = config
        for(const [name, service] of Object.entries(this._services)){
            service.configure(this._config)
        }
    }

    public isServiceEnabled(name: string) : boolean{
        if(this._services.hasOwnProperty(name)){
            return this._services[name].enabled
        }
        return false
    }

    public isServiceLoggedIn(name: string) : boolean{
        if(this._services.hasOwnProperty(name)){
            return this._services[name].enabled && this._services[name].loggedin
        }
        return false
    }

    public getService(name: string) : AccountService | undefined{
        if(this._services.hasOwnProperty(name)){
            return this._services[name]
        }
        return undefined
    }

    public get clients(): ClientManager{
        return this._clients
    }
}