import TicketDTO from '../../dtos/ticket.dto.js'

export default class TicketRepository {
  constructor(dao) {
    this.dao = dao
  }

  getTickets = () => {
    const result = this.dao.getTickets()
    return result
  }

  getTicketById = (id) => {
    const ticket = this.dao.getTicketById(id)
    return ticket
  }

  createTicket = (ticket) => {
    const newTicket = new TicketDTO(ticket)
    const result = this.dao.createTicket(newTicket)
    return result
  }

}