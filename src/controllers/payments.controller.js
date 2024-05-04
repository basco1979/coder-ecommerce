import { ticketsService } from '../dao/repositories/index.js'
import Stripe from 'stripe'
import PaymentService from '../services/payment.js'
let stripe = Stripe(process.env.STRIPE)

export const paymentIntent = async (req, res) => {
  const tid = req.params.tid
  const ticket = await ticketsService.getTicketById(tid)
  const amount = ticket.amount
  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
    })
    .then((customer) =>
      stripe.charges.create({
        amount: amount * 100,
        description: 'Ticket',
        currency: 'usd',
        customer: customer.id,
      })
    )
    .then((charge) => res.render('success', {title: "Success", style: 'success.css'}))
}
