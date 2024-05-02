import mongoose from "mongoose";
import { getVariables} from "../../config/config.js";
import { Command } from "commander";

const program = new Command()
program.option('--persistence <persistence>')
const options = program.parse()
const { mongoUrl, persistence} = getVariables(options)
let Tickets;

switch (persistence) {
    case 'MONGO':
        const {default : TicketMongo} = await import('../mongo/ticket.mongo.js');
        mongoose.connect(mongoUrl);
        Tickets = TicketMongo;    
        break;

    case 'MEMORY':
        const {default : TicketMemory} = await import ('../memory/ticket.memory.js');
        Tickets = TicketMemory;
    break;
}

export default Tickets;