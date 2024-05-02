import { Router } from 'express'
import { getTickets, getTicketById, createTicket } from '../controllers/tickets.controller.js'
import { applyPolicies } from '../middlewares/auth.js'

const ticketsRouter = Router()

ticketsRouter.get('/', applyPolicies(['ADMIN']), getTickets)
ticketsRouter.get('/:tid',  applyPolicies(['USER', 'PREMIUM']), getTicketById)
ticketsRouter.post('/',  applyPolicies(['USER', 'PREMIUM']), createTicket)

export default ticketsRouter