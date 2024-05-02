import { ticketsService } from '../dao/repositories/index.js'
import Stripe from 'stripe'
import PaymentService from '../services/payment.js'
let stripe = Stripe(process.env.STRIPE)

export const paymentIntent = async (req, res) => {
  const tid = req.params.tid
  const ticket = await ticketsService.getTicketById(tid)
  const amount = ticket.amount
/*   const paymentIntent = {
      amount: amount*100,
      currency: 'usd',
    }
    const service = new PaymentService()
    let result = await service.createPaymentIntent(paymentIntent)
    res.send({status: "success", payload: result}) */

     stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer => stripe.charges.create({
    amount : amount*100,
    description: 'Ticket',
    currency: 'usd',
    customer: customer.id 
  }))
  .then(charge => res.render('success'));

}
