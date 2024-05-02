import { ticketsService} from '../dao/repositories/index.js'

export const getTickets = async(req, res) => {
const tickets = await  ticketsService.getTickets()
res.send(tickets);
}

export const getTicketById = async (req, res) => {
  const tid = req.params.tid
  const ticket = await ticketsService.getTicketById(tid)
  if (!ticket) {
      res.send({ message: 'Ticket Not found' })
    } else {
      res.send({ ticket })
    }
}

export const createTicket = async (req, res) => {
  let ticket = req.body
  ticket.code =  crypto.getRandomValues(new  Uint32Array(1))[0].toString()
  ticket.purchase_datetime = Date.now()
  try {
    const result = await ticketsService.createTicket(ticket)
    res.send(result)
  } catch (err) {
    req.logger.error(`${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()} -Error to create ticket` + err)
    res.status(500).send('ticket error')
  }
}
