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
     * 
     */
    deleteObsolete? : boolean
    /**
     * Default value. Is ignored when subel is set. If the default value is given required will be ignored
     */
    defaultVal? : any
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
    resultObj?: any,
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

function makeResultOk(defaultsApplied: boolean, resultObj) : CheckResult{
    return {
        ok: true,
        appliedDefaults: defaultsApplied,
        resultObj
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

function checkDefaultVal(option: TypeOption){
    return option.hasOwnProperty('defaultVal') && option.defaultVal !== undefined
}

export function checkType(option: TypeOption, check: any, applyDefaults?: boolean) : CheckResult{
    return checkTypeRec(_.cloneDeep(option), _.cloneDeep(check), _.defaultTo(applyDefaults, true), '$')
}

function checkObject(options: CheckOptions, check: object, applyDefaults: boolean, deleteObsolete: boolean, objpath : string) : CheckResult{
    objpath += '.'
    let appliedDefaults = false
    for(let [key, option] of Object.entries(options)){
        const subResult = checkTypeRec(option, check[key], applyDefaults, objpath + key)
        if(subResult.ok){
            appliedDefaults = subResult.appliedDefaults
            check[key] = subResult.resultObj
        }
        else {
            subResult.appliedDefaults = subResult.appliedDefaults || appliedDefaults
            return subResult
        }
    }

    if(deleteObsolete){
        check = _.pick(check, Object.keys(options))
    }

    return makeResultOk(appliedDefaults, check)
}

function checkTypeRec(option: TypeOption, check: any, applyDefaults: boolean, objpath : string) : CheckResult{
    _.defaults(option, {
        subel: undefined,
        required: false,
        deleteObsolete: true,
        checkfunction: () => true
    })

    let appliedDefaults = false

    // Value defined
    if(check !== undefined){
        // Option for subelements are defined. Therefore it has to be a object
        if(!_.isNil(option.subel)){
            // If it isn't an object but subel is defined, then it is a wrong type
            if(!_.isObjectLike(check)){
                return makeResultError(objpath, FailureType.WRONG_TYPE, appliedDefaults)
            }
            // It is a object so we check the object structure
            else {
                const subResult = checkObject(option.subel, check , applyDefaults, option.deleteObsolete, objpath)
                if(subResult.ok){
                    appliedDefaults = subResult.appliedDefaults
                    check = subResult.resultObj
                }
                else {
                    subResult.appliedDefaults = subResult.appliedDefaults || appliedDefaults
                    return subResult
                }
            }
        }
    }
    // Value undefined but defaults should be applied
    else if(applyDefaults){
        // It is a object that has child elements with default values
        // So we make a empty object and handle it as a normal object
        if(hasSubDefaults(option.subel)){
            check = {}
            const subResult = checkObject(option.subel, check, applyDefaults, option.deleteObsolete, objpath)
            if(subResult.ok){
                appliedDefaults = subResult.appliedDefaults
                check = subResult.resultObj
            }
            else {
                subResult.appliedDefaults = subResult.appliedDefaults || appliedDefaults
                return subResult
            }
        }
        // Subel isn't set (therefor not an object) and defaultVal is defined
        else if(_.isNil(option.subel) && checkDefaultVal(option)){
            check = _.cloneDeep(option.defaultVal)
            appliedDefaults = true
        }
    }


    // check isn't defined (either because applying defaults is disabled or not set in the config) but it is required => error
    if(check === undefined && option.required){
        return makeResultError(objpath, FailureType.MISSING_KEY, appliedDefaults)
    }
    // the given check-function decides at the end if the type is correct
    if(check !== undefined && !option.checkfunction(check)){
        return makeResultError(objpath, FailureType.WRONG_TYPE, appliedDefaults)
    }

    return makeResultOk(appliedDefaults, check)
}