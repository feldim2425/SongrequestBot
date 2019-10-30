import BackendConnection from './websocket';
import store from './vuex_store';
import { songsFromCmdObjects } from './song';

export default function attatchHandler(connection:BackendConnection): void{
    connection.on('command', (cmd, args) => handleCommand(connection, cmd, ...args))
}

export function handleCommand(connection:BackendConnection, cmd:string, ...args:any[]) : void{
    switch(cmd){
        case 'addsongs':
            store.dispatch('addSongs', songsFromCmdObjects(args))
        default:
            console.log(`Unknown command: ${cmd}`)
    }
}