import { EventEmitter } from 'events';
import {Client} from 'tmi.js'


class TwitchInput extends EventEmitter {
    private _tmi : Client

    public connect(): void{
       // this._tmi = new Client({});
    }
}