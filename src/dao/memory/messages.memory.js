export default class Messages {
    constructor(){
        this.messages = [];
    }

    get = () => {
        return this.messages;
    }

    post = (message) => {
        this.messages.push(message);
        return true;
    }
}