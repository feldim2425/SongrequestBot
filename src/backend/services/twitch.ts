import { EventEmitter } from 'events';
import tmi from 'tmi.js'
import ServiceManager, { AccountService } from './service_manager';
import _ from 'lodash';
import { MessageType } from '~common/remote/message';

type TwitchConfig = {
    username: string,
    oauth: string
    channels: string[]
}

export default class TwitchService extends EventEmitter implements AccountService {

    private _manager: ServiceManager
    private _enabled: boolean = false;
    private _data: TwitchConfig = {username: undefined, oauth: undefined, channels: []}
    loggedin: boolean;

    registered(manager: ServiceManager) {
        this._manager = manager
    }

    public configure(config: object) {
        let ndata: TwitchConfig = {
            oauth: _.get(config, 'logins.twitch.oauth'),
            username: _.get(config, 'logins.twitch.username'),
            channels: []
        }
        let channel :string = _.get(config, 'inputs.twitch_channel')
        if(!_.isEmpty(channel)){
            if(channel.startsWith('#')){
                channel = '#' + channel
            }
            ndata.channels.push(channel)
        }
        let enabled = _.get(config, 'logins.twitch.enabled', false)

        if(_.isEmpty(ndata.oauth) || _.isEmpty(ndata.username) || _.isEmpty(ndata.channels)){
            enabled = false
        }

        const forceReconnect = !_.isEqual(ndata, this._data)
        this._data = ndata

        if(this._enabled !== enabled){
            this._enabled = enabled
            if(this._enabled){
                this.connect()
            }
            else {
                this.disconnect()
            }
        }
        else if(forceReconnect && this._enabled){
            this.disconnect()
            this.connect()
        }
    }

    private _tmi : tmi.Client

    public connect(): void{
        this._tmi = tmi.client({
            identity: {
                username: this._data.username,
                password: this._data.oauth
            },
            channels: this._data.channels
        });
        this._manager.clients.removeMessage('service_twitch_error')
        this._tmi.on('connected', () => console.log(`Twitch service connected to [${this._data.channels.join(', ')}]`));
        this._tmi.connect().catch((e)=> {
            this._manager.clients.putMessage({
                id:'service_twitch_error',
                title: 'Twitch connection failed',
                message: `${e}`,
                type: MessageType.ERROR
            })
        })
    }

    public disconnect(): void{
        this._manager.clients.removeMessage('service_twitch_error')
        if(this._tmi === undefined){
            return
        }
        this._tmi.disconnect().then(_.noop, _.noop)
    }

    public get enabled(): boolean{
        return this._enabled
    }
}