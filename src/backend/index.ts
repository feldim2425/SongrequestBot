import process from 'process'

import Server from './connection/server'
import { ClientManager } from './connection/clients'
import { ConfigHandler } from './config/config'


const config = new ConfigHandler('./config.json5') // TODO: Add cmd argument to change the config
config.on('error', console.error)
config.on('update_config', (old, n) => console.log(n))
config.loadConfig()


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