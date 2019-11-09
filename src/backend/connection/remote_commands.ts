import { ClientManager, FrontendConnection } from './clients'
import { ConfigHandler } from '../config/config'
import _ from 'lodash'
import crypto from 'crypto'

export default function attachHandler(manager:ClientManager, config: ConfigHandler): void{
    manager.on('command', (con, cmd, args) => handleCommand(manager, config, con, cmd, ...args))
}

export function handleCommand(manager:ClientManager, config:ConfigHandler, con:FrontendConnection, cmd:string, ...args:any[]) : void{

    if(!con.authenticated && cmd !== 'login'){
        con.sendCommand('login_required')
        return
    }

    switch(cmd){
        case 'mutate_config':
            if(args.length === 1 && _.isObject(args[0])){
                const result = config.setConfig(_.defaultsDeep({}, args[0], config.configuration))
                if(result.ok){
                    console.info('Configuration updated')
                }
                else {
                    console.warn(`Invalid config mutation recieved: ${result.error.message}`)
                }
            }
            break
        case 'login':
            if(args.length === 1 && _.isString(args[0])){
                const hash = crypto.createHash('sha256')
                hash.update(args[0])
                if(hash.digest('hex').toLowerCase() === config.configuration['server']['dashboard_sha256'].toLowerCase()){
                    con.authenticated = true
                }
                else {
                    con.sendCommand('login_wrong')
                }
            }
            break
        case 'logout':
            if(args.length === 0 && !_.isEmpty(config.configuration['server']['dashboard_sha256'])){
                con.authenticated = false
            }
            break
        default:
            console.log(`Unknown command: ${cmd}`)
    }
}