import process from 'process'

import Server from './server'

const server = new Server(__dirname)
console.log(`Server resources: ${server.resources}`)
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