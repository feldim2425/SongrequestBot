import { EventEmitter } from 'events';
import {Client} from 'tmi.js'
import { AccountService } from './service_manager';
import _ from 'lodash';


export default class TwitchService extends EventEmitter implements AccountService {

    private _enabled: boolean = false;
    loggedin: boolean;

    public configure(config: object) {
        const oauth = _.get(config, 'logins.twitch.oauth')
        const username = _.get(config, 'logins.twitch.username')
        let enabled = _.get(config, 'logins.twitch.enabled', false)

        if(_.isEmpty(oauth) || _.isEmpty(username)){
            enabled = false
        }

        if(this._enabled !== enabled){
            this._enabled = enabled
            if(enabled){
                this.connect()
            }
            else {
                this.disconnect()
            }
        }
    }

    private _tmi : Client

    public connect(): void{
        console.debug('>> CONNECT')
       // this._tmi = new Client({});
    }

    public disconnect(): void{
        console.debug('>> DISCONNECT')
        // this._tmi = new Client({});
    }

    public get enabled(): boolean{
        return this._enabled
    }
}