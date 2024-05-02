export default class Tickets {
    constructor(){
        this.tickets = [];
    }

    get = () => {
        return this.tickets;
    }

    post = (ticket) => {
        this.tickets.push(ticket);
        return true;
    }
}