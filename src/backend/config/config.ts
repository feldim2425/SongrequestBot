import _ from 'lodash'
import path from 'path'
import fs from 'fs'
import { EventEmitter } from 'events'
import { CheckOptions, checkType } from '../utils/objtypecheck'
import JSON5 from 'json5'
import CHECK_CONFIG from './checkConfigObject'
import { timingSafeEqual } from 'crypto'

export class ConfigHandler extends EventEmitter {

    private _path: string
    private _configBuffer: object | undefined
    private _fallback: boolean = true

    constructor(confPath: string){
        super()
        this._path = path.resolve(confPath)
        this.clearBuffer()
    }

    private _handleWriteError(err: NodeJS.ErrnoException){
        if(!_.isNil(err)){
            this.emit('error', err)
        }
        else {
            this.emit('write_done')
        }
    }

    private _handleReadError(err: NodeJS.ErrnoException): boolean{
        if(!_.isNil(err)){
            if(err.code === 'ENOENT'){
                this.resetConfig()
            }
            else {
                this.emit('error', err)
            }
            return true;
        }
        return false;
    }

    public clearBuffer(){
        this._fallback = true
        const result = checkType(CHECK_CONFIG, {})
        this._configBuffer = _.defaultTo(result.resultObj, {})
    }

    public resetConfig() : void {
        const result = checkType(CHECK_CONFIG, {})
        let configObject:object = _.defaultTo(result.resultObj, {})
        this.emit('update_config', this._configBuffer, configObject)
        this._configBuffer = configObject
        this._fallback = false
        fs.writeFile(this._path, JSON5.stringify(configObject), { encoding: 'utf8' }, this._handleWriteError.bind(this))
    }

    public loadConfig() : void{
        fs.readFile(this._path,  { encoding: 'utf8' }, (err: NodeJS.ErrnoException | null, data: string) => {
            if(this._handleReadError(err)){
                return
            }

            let jsonData: any;
            try {
                jsonData = JSON5.parse(data)
            }
            catch(e){
                this.emit('error', e)
                return
            }

            let result = checkType(CHECK_CONFIG, jsonData)
            if(!result.ok){
                this.emit('error', new SyntaxError(result.error.message))
            }
            else {
                this.emit('update_config', this.configuration, result.resultObj)
                this._fallback = false
                this._configBuffer = result.resultObj
            }
        })
    }

    public setConfig(config: object) : void{
        config = _.cloneDeep(config)
        this.emit('update_config', this.configuration, config)
        checkType(CHECK_CONFIG, config)
        this._configBuffer = config
        fs.writeFile(this._path, JSON5.stringify(config), { encoding: 'utf8' }, this._handleWriteError.bind(this))
    }

    public get configuration(): object{
        return _.cloneDeep(this._configBuffer)
    }

    public get isLoaded(): boolean{
        return !this._fallback
    }
}