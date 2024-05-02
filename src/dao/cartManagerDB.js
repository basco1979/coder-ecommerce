import { cartModel } from "./models/cart.model.js"


export default class CartManagerDB {
  constructor() {
    this.products = []
  }

  async addCart() {
    const cart = {
      products: []
    }
  await cartModel.create(cart)
  }

  async addProductToCart(id, product) {
    const cart = await cartModel.findById({_id : id})
    if (!cart) {
      console.log('No se encontro el carrito de compras')
    } else {
      //si no tiene el producto lo agrega al carrito
      if (!cart.products.some((p) => p.product.toString() === product)) {
        cart.products.push({ product : product, quantity: 1 })
      } else {
        // si ya existe el producto aumenta la cantidad del mismo
        for (let i = 0; i < cart.products.length; i++) {
          if (cart.products[i].product.toString() === product) {
            cart.products[i].quantity += 1
          }
        }
      }
    }
    await cartModel.updateOne({_id : id}, cart)
  }

  async getCarts() {
  const carts = await cartModel.find()
  return carts
  }

  async getCartById(id) {
    const cart = await cartModel.findById({_id : id}).populate('products').populate('products.product')
    if (cart) {
      return cart
    } else {
      console.log('Id no existe')
    }
  }

    async updateCart(id, newCart) {
    const cart = await cartModel.updateOne({_id : id}, newCart)
    return cart
  }

  async deleteCart(id) {
    const cart = await cartModel.deleteOne({_id : id})
    return cart
  }
}
