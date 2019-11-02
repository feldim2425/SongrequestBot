import _ from 'lodash';
import { is } from '@babel/types';

export type CheckOptions = {
    [key : string] : TypeOption
}

export type CheckFunction = (value: any) => boolean

export type TypeOption = {
    /**
     * Function that gets called to check the element. <br>
     * When subel is given, the checkfunction will only get called after a builtin "typeof object". <br>
     * If no function is given it will be set to a default function that always returns true.
     */
    checkfunction? : CheckFunction,
    /**
     * If set to true the key has to exist in the object. Defaults to false
     */
    required? : boolean,
    /**
     * Check for sub elements. If this attribute is set the key has to contain an object even if checkfunction is given.
     */
    subel? : CheckOptions
    /**
     * Default value. Is ignored when subel is set. If the default value is given required will be ignored
     */
    defaultVal?: any
} 

export enum FailureType {
    MISSING_KEY,
    WRONG_TYPE,
    OTHER
}

export type CheckResult = {
    error?: {
        message: string,
        type: FailureType,
        key: string
    },
    appliedDefaults: boolean,
    ok: boolean
}

function makeResultError(key: string, failure: FailureType, defaultsApplied: boolean) : CheckResult{
    let result:CheckResult = {
        ok: false,
        appliedDefaults: defaultsApplied
    }
    result.error = {
        key,
        type: failure,
        message: undefined
    }

    switch(failure){
        case FailureType.MISSING_KEY:
            result.error.message = `${key} is missing`
            break
        case FailureType.WRONG_TYPE:
            result.error.message = `${key} has the wrong type`
            break
        default:
            result.error.message = `Unknown error at ${key}`
    }
    return result
}

function makeResultOk(defaultsApplied: boolean) : CheckResult{
    return {
        ok: true,
        appliedDefaults: defaultsApplied
    }
}

function hasSubDefaults(options: CheckOptions) : boolean{
    if(_.isNil(options)){
        return false
    }

    for(let [key, option] of Object.entries(options)){
        if(hasSubDefaults(option.subel)){
            return true
        }
        else if(option.defaultVal !== undefined && _.isNil(option.subel)){
            return true
        }
    }
    return false
}

export function checkObject(options: CheckOptions, check: object, applyDefaults?: boolean, _objpath = '') : CheckResult{

    applyDefaults = _.isNil(applyDefaults) ? true : applyDefaults
    _objpath = _objpath.length > 0 ? _objpath + '.' : _objpath
    let defaultsApplied = false;

    for(let [key, option] of Object.entries(options)){
        _.defaults(option, {
            subel: undefined,
            required: false,
            defaultVal: undefined,
            checkfunction: () => true
        })

        // Key exists and it's value isn't undefined
        if(check.hasOwnProperty(key) && check[key] !== undefined){ 
            if(!_.isNil(option.subel)){
                if(!_.isObjectLike(check[key]) || !option.checkfunction(check[key])){
                    return makeResultError(_objpath + key, FailureType.WRONG_TYPE, defaultsApplied)
                }

                let subResult = checkObject(option.subel, check[key], applyDefaults, _objpath + key)
                if(!subResult.ok){
                    subResult.appliedDefaults = subResult.appliedDefaults || defaultsApplied
                    return subResult
                }
            }
            else if (!option.checkfunction(check[key])) {
                return makeResultError(_objpath + key, FailureType.WRONG_TYPE, defaultsApplied)
            }
        }
        // Key doesn't exist (or value is undefined) but we are allowed to apply default values
        else if(applyDefaults){
            // Apply defaults to sub-object. hasSubDefaults checks for sub-object automatically.
            // If no sub defaults are set the sub-object isn't set either
            if(hasSubDefaults(option.subel)){
                check[key] = {}
                if(!option.checkfunction(check[key])){
                    return makeResultError(_objpath + key, FailureType.WRONG_TYPE, defaultsApplied)
                }

                let subResult = checkObject(option.subel, check[key], applyDefaults, _objpath + key)
                defaultsApplied = true
                if(!subResult.ok){
                    subResult.appliedDefaults = true
                    return subResult
                }
                
            }
            // Just setting the normal default for non-sub-objects
            else if(_.isNil(option.subel) && option.defaultVal !== undefined){
                check[key] = _.cloneDeep(option.defaultVal)

                if(!option.checkfunction(check[key])) {
                    return makeResultError(_objpath + key, FailureType.WRONG_TYPE, defaultsApplied)
                }
                defaultsApplied = true
            }
        }
        // Key doesn't exist (or value is undefined), we aren't allowed to apply defaults and the key is required => Error
        else if(option.required) {
            return makeResultError(_objpath + key, FailureType.MISSING_KEY, defaultsApplied)
        }
    }
    return makeResultOk(defaultsApplied)
}