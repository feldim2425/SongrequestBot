
/**
 * Error used for illegal states or function/method calls in a state that doesn't allow their execution
 */
export class StateException extends Error{
    constructor(message){
        super(message)
    }
}