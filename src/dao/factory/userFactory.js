import mongoose from "mongoose";
import { getVariables} from "../../config/config.js";
import { Command } from "commander";

const program = new Command()
program.option('--persistence <persistence>')
const options = program.parse()
const { mongoUrl, persistence} = getVariables(options)
let Users;

switch (persistence) {
    case 'MONGO':
        const {default : UserMongo} = await import('../mongo/users.mongo.js');
        mongoose.connect(mongoUrl);
        Users = UserMongo;    
        break;

    case 'MEMORY':
        const {default : UserMemory} = await import ('../memory/users.memory.js');
        Users = UserMemory;
    break;
}

export default Users;