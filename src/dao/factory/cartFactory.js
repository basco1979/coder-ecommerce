import mongoose from "mongoose";
import { getVariables} from "../../config/config.js";
import { Command } from "commander";

const program = new Command()
program.option('--persistence <persistence>')
const options = program.parse()
const { mongoUrl, persistence} = getVariables(options)
let Carts;

switch (persistence) {
    case 'MONGO':
        const {default : CartMongo} = await import('../mongo/carts.mongo.js');
        mongoose.connect(mongoUrl);
        Carts = CartMongo;    
        break;

    case 'MEMORY':
        const {default : CartMemory} = await import ('../memory/carts.memory.js');
        Carts = CartMemory;
    break;
}

export default Carts;