import PaymentService from "../services/payment.js"

export const paymentIntent = async (req, res) => {
  const { amount } = req.body
  const paymentIntentInfo = {
    amount,
    currency: 'usd',
  }
  const service = new PaymentService()
  let result = await service.createPaymentIntent(paymentIntentInfo)
  res.send({status: success, payload: result})
}
