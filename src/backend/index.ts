import process from 'process'

import Server from './connection/server'
import { ClientManager } from './connection/clients'
import { ConfigHandler } from './config/config'
import parseCliArguments from './utils/cli_args'
import attachHandler from './connection/remote_commands'
import ServiceManager from './services/service_manager'
import TwitchService from './services/twitch'
import { MessageType } from '~common/remote/message'

const args = parseCliArguments()

const config = new ConfigHandler(args.config)
config.on('error', console.error)
//config.on('update_config', (old, n) => console.log(n))

const server = new Server(__dirname)
console.log(`Server resources: ${server.resources}`)
const clientHandler = new ClientManager(server, config);

config.on('update_config', (old,n) => server.updateServerConfiguration(n.server))
config.loadConfig()

const serviceManager = new ServiceManager(clientHandler);
config.on('update_config', (old,n) => serviceManager.updateConfiguration(n))
serviceManager.registerService('twitch', new TwitchService())

server.startServer();

attachHandler(clientHandler, config)

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