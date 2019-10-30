import process from 'process'

import Server from './server'
import { ClientManager } from './clients'

const server = new Server(__dirname)
console.log(`Server resources: ${server.resources}`)
const clientHandler = new ClientManager(server);
server.startServer();

function onExit(){
    server.stopServer()
    console.log('Programm exiting...')
}
process.on('exit', onExit)

function signalRecieved(){
    process.exit(0)
}
process.on('SIGINT', signalRecieved)
process.on('SIGHUP', signalRecieved)
process.on('SIGTERM', signalRecieved)