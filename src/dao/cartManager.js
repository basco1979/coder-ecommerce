import fs from 'fs'

export default class CartManager {
  constructor(path) {
    this.products = []
    this.path = path
  }

  static id = 0

  async addCart() {
    const carts = await this.getCarts()
    let maxCode =
      carts.length === 0
        ? 0
        : Math.max.apply(
            Math,
            carts.map(function (o) {
              return o.id
            })
          )
    const cart = {
      id: Number(maxCode + 1),
      products: []
    }
    carts.push(cart)
    await fs.promises.writeFile(this.path, JSON.stringify(carts), 'utf-8')
  }

  async addProductToCart(id, product) {
    const carts = await this.getCarts()
    const cart = carts.find((cart) => Number(cart.id) === Number(id))
    if (!cart) {
      console.log('No se encontro el carrito de compras')
    } else {
      //si no tiene el producto lo agrega al carrito
      if (!cart.products.some((p) => Number(p.id) === Number(product.id))) {
        cart.products.push({ ...product })
      } else {
        // si ya existe el producto aumenta la cantidad del mismo
        for (let i = 0; i < cart.products.length; i++) {
          if (Number(cart.products[i].id) === Number(product.id)) {
            cart.products[i].quantity += 1
          }
        }
      }
    }
    await fs.promises.writeFile(this.path, JSON.stringify(carts), 'utf-8')
  }

  async getCarts() {
    try {
      const carts = await fs.promises.readFile(this.path, 'utf-8')
      const parsedCarts = JSON.parse(carts)
      return parsedCarts
    } catch (error) {
      console.log('No hay carritos')
      return []
    }
  }

  async getCartById(id) {
    const carts = await this.getCarts()
    const cart = carts.find((cart) => Number(cart.id) === Number(id))
    if (cart) {
      return cart
    } else {
      console.log('Id no existe')
    }
  }
}
