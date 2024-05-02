import mongoose from "mongoose";
import { getVariables} from "../../config/config.js";
import { Command } from "commander";

const program = new Command()
program.option('--persistence <persistence>')
const options = program.parse()
const { mongoUrl, persistence} = getVariables(options)
let Products;

switch (persistence) {
    case 'MONGO':
        const {default : ProductMongo} = await import('../mongo/products.mongo.js');
        mongoose.connect(mongoUrl);
        Products = ProductMongo;    
        break;

    case 'MEMORY':
        const {default : ProductMemory} = await import ('../memory/products.memory.js');
        Products = ProductMemory;
    break;
}

export default Products;