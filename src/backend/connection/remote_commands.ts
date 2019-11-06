import { ClientManager } from './clients'
import { ConfigHandler } from '../config/config'
import _ from 'lodash'

export default function attachHandler(manager:ClientManager, config: ConfigHandler): void{
    manager.on('command', (cmd, args) => handleCommand(manager, config, cmd, ...args))
}

export function handleCommand(manager:ClientManager, config:ConfigHandler, cmd:string, ...args:any[]) : void{
    switch(cmd){
        case 'mutate_config':
            if(args.length == 1 && _.isObject(args[0])){
                const result = config.setConfig(_.defaultsDeep({}, args[0], config.configuration))
                if(result.ok){
                    console.info('Configuration updated')
                }
                else {
                    console.warn(`Invalid config mutation recieved: ${result.error.message}`)
                }
            }
            break
        default:
            console.log(`Unknown command: ${cmd}`)
    }
}