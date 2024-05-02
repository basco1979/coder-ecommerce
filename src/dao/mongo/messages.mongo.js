import { messageModel } from "../models/message.model.js";

export default class Messages {
    constructor(){}

    get = async () => {
        const messages = await messageModel.find()
        return messages;
    }

    post = async (message) => {
        try {
            const result = await messageModel.create(message);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    put = async (id, message) => {
        try {
            const result = await messageModel.findOneAndUpdate({_id: id}, message);
            return true;
        } catch (error) {
            return false;
        }
    }

    delete = async (id) => {
        try {
            const result = await messageModel.deleteOne({_id: id});
            return true;
        } catch (error) {
            return false;
        }
    }
}