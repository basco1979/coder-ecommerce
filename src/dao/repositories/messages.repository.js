import MessageDTO from "../../dtos/message.dto.js";

export default class MessageRepository {
    constructor(dao){
        this.dao = dao;
    }

    getMessages = () => {
        const result = this.dao.get();
        return result;
    }

    createMessage =  (message) => {
        const newMessage = new MessageDTO(message);
        const result = this.dao.post(newMessage);
        return result;
    }

}