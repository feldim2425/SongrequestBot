import BackendConnection from './websocket';
import store from './vuex_store';
import { songsFromCmdObjects } from './song';
import _ from 'lodash';

export default function attachHandler(connection:BackendConnection): void{
    connection.on('command', (cmd, args) => handleCommand(connection, cmd, ...args))
}

export function handleCommand(connection:BackendConnection, cmd:string, ...args:any[]) : void{
    switch(cmd){
        case 'addsongs':
            store.dispatch('addSongs', songsFromCmdObjects(args))
            break
        case 'syncsongs':
            store.dispatch('setSongs', songsFromCmdObjects(args))
            break
        case 'setplaying':
            if(args.length == 1 && _.isString(args[0])){
                store.dispatch('playing', args[0])
            }
            break
        case 'update_config':
            if(args.length == 1 && _.isObject(args[0])){
                store.dispatch('updateConfig', args[0])
            }
            break
        default:
            console.log(`Unknown command: ${cmd}`)
    }
}