import { productModel } from '../dao/models/product.model.js'
import { userModel } from '../dao/models/user.model.js'
import {
  cartsService,
  ticketsService,
  usersService,
} from '../dao/repositories/index.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import stripe from 'stripe'
const stripeInstance = stripe(process.env.STRIPE)

dotenv.config()

export const getIndexPage = (req, res) => {
  const { first_name, last_name } = req.session.user
  res.render('index', {
    first_name,
    last_name,
    title: 'Index',
    style: 'index.css',
  })
}

export const getLoginPage = (req, res) => {
  res.render('login', { title: 'Login', style: 'login.css' })
}

export const getRegisterPage = (req, res) => {
  res.render('register', { title: 'Register', style: 'register.css' })
}

export const getChatPage = async (req, res) => {
  res.render('chat', { title: 'Chat', style: 'chat.css' })
}

export const getProductsPage = async (req, res) => {
  const { first_name, last_name, role, cartId } = req.session.user
  const cart = await cartsService.getCartById(cartId)
  const cart_quantity = cart.products.length
  let { page } = req.query
  if (!page || isNaN(Number(page))) page = 1
  const products = await productModel.paginate({}, { limit: 10, page: page })
  products.prevLink = `/products/?page=${Number(page) - 1}`
  products.nextLink = `/products/?page=${Number(page) + 1}`
  res.render('products', {
    first_name,
    last_name,
    role,
    cartId,
    products,
    cart,
    cart_quantity,
    title: 'Products',
    style: 'products.css',
  })
}

export const addProductInCart = async (req, res) => {
  const { pid, cid } = req.params
  try {
    const prod = await productModel.findOne({ _id: pid })
    const user = await userModel.findOne({ cartId: cid })
    if (prod.owner !== user.email) {
      const result = await cartsService.addProductToCart(cid, pid)
      res.redirect('/products')
    } else {
      return res
        .status(403)
        .json({
          message: "You can't put your own products in the shopping cart",
        })
    }
  } catch (err) {
    req.logger.error(
      `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()} - Error to add product`
    )
  }
}

export const deleteProductInCart = async (req, res) => {
  const { cid, pid } = req.params
  try {
    const result = await cartsService.deleteProductInCart(cid, pid)
    res.redirect(`/cart/${cid}/`)
  } catch (err) {
    req.logger.error(
      `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()} - Error to delete product`
    )
  }
}

//Empty cart
export const deleteCart = async (req, res) => {
  const { cid } = req.params
  try {
    const cart = await cartsService.deleteCart(cid)
    res.redirect(`/cart/${cid}/`)
  } catch (error) {
    req.logger.error(`${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()} - Error to empty cart`)
  }
}


export const getCartDetailPage = async (req, res) => {
  const { cid } = req.params
  const cart = await cartsService.getCartById(cid)
  let subtotal = 0
  cart.products.forEach((item) => {
    let result = item.quantity * item.product.price
    subtotal += result
  })
  let total = subtotal.toFixed(2)
  if (cart) {
    res.render('cart', {
      cart,
      total,
      title: 'Cart Detail',
      style: 'cartDetail.css',
    })
  } else res.status(404).send({ error: 'Cart not found' })
}

export const getCheckoutPage = async (req, res) => {
  const cid = req.params.cid
  const ticket = await cartsService.purchaseCart(cid)
  ticket.amount = ticket.amount.toFixed(2)
  const cart = await cartsService.getCartById(cid)

  res.render('checkout', {
    ticket,
    cart,
    title: 'Checkout',
    style: 'checkout.css',
  })
}

export const getPaymentPage = async (req, res) => {
  const tid = req.params.tid
  const ticket = await ticketsService.getTicketById(tid)
  const amount = Math.round(parseFloat(ticket.amount) * 100)
  const user = req.user
  res.render('payment', {
    ticket,
    amount,
    user,
    stripePublishableKey: process.env.STRIPE_PUBLIC,
    title: 'Payment',
    style: 'payment.css',
  })
}

export const restorePassword = (req, res) => {
  let { email, token } = req.query
  try {
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      if (err) {
        return res.redirect('send-email')
      } else {
        return res.render('restore-password', { email, token })
      }
    })
  } catch (err) {
    console.log(err)
  }
}

export const sendEmail = (req, res) => {
  res.render('send-email')
}

export const getFailRegisterPage = (req, res) => {
  res.render('failregister')
}

export const getFailLoginPage = (req, res) => {
  res.render('faillogin')
}

export const createProductPage = (req, res) => {
  res.render('create-product', {
    title: 'Create Product',
    style: 'create-product.css',
  })
}

export const updateProductPage = async (req, res) => {
  const { pid } = req.params
  try {
    const product = await productModel.findOne({ _id: pid })
    res.render('update-product', {
      product,
      title: 'Update Product',
      style: 'update-product.css',
    })
  } catch (err) {
    req.logger.error(
      `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()} - "Error" `,
      err
    )
  }
}

export const deleteProductPage = (req, res) => {
  res.render('delete-product')
}

export const usersPage = async (req, res) => {
  const users = await usersService.getUsers()
  res.render('users', { users })
}

export const updateUserRolPage = (req, res) => {
  res.render('users-role')
}

export const deleteUserPage = (req, res) => {
  res.render('delete-user')
}
