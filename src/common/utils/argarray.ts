import _ from 'lodash'

/**
 * Options for the mapArguments function
 */
export type ArgMapOptions = {
    /**
     * Optional function to check the value and/or type
     */
    checkFunction?: (val:any) => boolean,
    /**
     * Object key
     */
    key: string
}

/**
 * Maps a object of arguments to a array, according to the order defined by the order of options.
 * The options an optionaly contain a check function, to check the type and/or value
 * 
 * @param {(ArgMapOptions|string)[]} options Array of options or keys, the order defines the order of arguments
 * @param {object} args Object containing all keys defined by options.
 * 
 * @return a array of the sorted options or a string containing the error
 */
export default function mapArguments(options: (ArgMapOptions|string)[], args: object) : any[] | string{
    let sorted: any[] = []
    for(const [i, option] of options.entries()){
        let key : string
        let checkFunction = (val: any) => true
        if(_.isString(option)) {
            key = option
        }
        else if(_.isObject(option)){
            if(!_.isNil(option.checkFunction)){
                checkFunction = option.checkFunction
            }
            key = option.key
        }
        else {
            return `Invalid option type ${typeof(option)}`
        }

        if(!(key in args)){
            return `No key ${key}`
        }
        else if(!checkFunction(args[key])){
            return `Check for type of ${key} failes`
        }
        sorted[i] = args[key]
    }

    return sorted
}