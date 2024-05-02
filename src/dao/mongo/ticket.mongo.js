import { ticketModel } from "../models/ticket.model.js";

export default class Tickets {
    constructor(){}

getTickets = async() => {
    const result = await ticketModel.find();
    return result;
}
getTicketById = async (id) => {
 try {
            const result = await ticketModel.findOne({_id: id});
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
}

createTicket = async(ticket) => {
     try {
            const result = await ticketModel.create(ticket);
            return result;
        } catch (error) {
            console.error(error);
            return false;
        }
}

}