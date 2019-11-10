

export type Message = {
    id: string,
    title: string,
    message: string,
    type: MessageType
}

export enum MessageType {
    UNKNOWN = 0,
    INFO = 1,
    WARNING = 2,
    ERROR = 3,
}

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