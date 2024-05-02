import mongoose from "mongoose";
import { getVariables} from "../../config/config.js";
import { Command } from "commander";

const program = new Command()
program.option('--persistence <persistence>')
const options = program.parse()
const { mongoUrl, persistence} = getVariables(options)
let Messages;

switch (persistence) {
    case 'MONGO':
        const {default : MessageMongo} = await import('../mongo/messages.mongo.js');
        mongoose.connect(mongoUrl);
        Messages = MessageMongo;    
        break;

    case 'MEMORY':
        const {default : MessageMemory} = await import ('../memory/messages.memory.js');
        Messages = MessageMemory;
    break;
}

export default Messages;