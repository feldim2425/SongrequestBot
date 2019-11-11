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