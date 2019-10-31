import _ from 'lodash'

export type ArgMapOptions = {
    checkFunction?: (val:any) => boolean,
    key: string
}

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