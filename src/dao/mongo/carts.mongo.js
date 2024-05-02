import { cartModel } from '../models/cart.model.js'
import { ticketModel } from '../models/ticket.model.js'

export default class Carts {
  constructor() {}

  getCarts = async () => {
    const carts = await cartModel.find()
    return carts
  }

  getCartById = async (id) => {
    const result = await cartModel.findById({_id : id}).populate('products').populate('products.product')
    if (!result) {
      CustomErrors.createError({
        name: 'find cart failed',
        cause: generateSingleIdError(id),
        message: 'Id does not exists',
        code: ErrorEnum.ID_NOT_FOUND,
      })
    }
    return result
  }

  saveCart = async (cart) => {
    try {
      const result = await cartModel.create(cart)
      return result
    } catch (error) {
      console.error(error)
      return false
    }
  }

  updateCart = async (id, cart) => {
    try {
      const result = await cartModel.findOneAndUpdate({ _id: id }, cart)
      return result
    } catch (error) {
      return false
    }
  }

  deleteCart = async (id) => {
    try {
      const result = await cartModel.deleteOne({ _id: id })
      return result
    } catch (error) {
      return false
    }
  }

  createTicket = async (ticket) => {
    try {
      const result = await ticketModel.create(ticket)
      return result
    } catch (error) {
      console.error(error)
      return false
    }
  }
}
