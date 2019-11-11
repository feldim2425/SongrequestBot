import {TypeOption, checkType} from '~common/utils/objtypecheck'
import _ from 'lodash'
import { MessageType, Message } from '~common/remote/message'

export function messageTypeToBootstrapVariant(type: MessageType): string{
    switch(type){
        case MessageType.INFO:
            return "info"
        case MessageType.WARNING:
            return "warning"
        case MessageType.ERROR:
            return "danger"
        default:
            return "secondary"
    }
}

const OBJ_CKECK_MESSAGE :TypeOption = {
    subel: {
        'id': {
            required: true,
            checkfunction: _.isString
        },
        'title': {
            required: true,
            checkfunction: _.isString
        },
        'message': {
            required: true,
            checkfunction: _.isString
        },
        'type': {
            checkfunction: (x) => Object.values(MessageType).includes(x),
            defaultVal: MessageType.UNKNOWN
        }
    }
}

export function verifyMessages(...messageObj: object[]): Message[]{
    let messages: Message[] = []
    for(const obj of messageObj){
        const result = checkType(OBJ_CKECK_MESSAGE, obj)
        if(result.ok){
            messages.push(result.resultObj)
        }
        else {
            console.warn(`Message parsing failed: ${result.error.message}`)
        }
    }
    return messages
}

export function getMessageTypePriority(type: MessageType): MessageType{
    switch(type){
        case MessageType.INFO:
            return 1
        case MessageType.WARNING:
            return 2
        case MessageType.ERROR:
            return 3
        default:
            return 0
    }
}

export function getMostImportantType(messages: Message[]): MessageType | undefined{
    let type: MessageType|undefined = undefined
    let weight = -1;
    for(const msg of messages){
        const nweight = getMessageTypePriority(msg.type)
        if(nweight > weight){
            weight = nweight
            type = msg.type
        }
    }
    return type
}