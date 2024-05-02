import Stripe from 'stripe'
import dotenv from 'dotenv'
dotenv.config()



export default class PaymentService {
    constructor(){
        this.stripe = new Stripe(process.env.STRIPE)
    }
    createPaymentIntent = async(data) => {
        const paymentIntent = this.stripe.paymentIntents.create(data)
        return paymentIntent   
    }
}