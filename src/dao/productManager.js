import fs from 'fs'

export default class ProductManager {
  constructor(path) {
    this.products = []
    this.path = path
  }

  static id = 0

  async addProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.code ||
      !product.stock ||
      !product.status ||
      !product.category
    ) {
      return console.log('Faltan datos para el registro del producto')
    }
    const products = await this.getProducts()
    let maxCode =
      products.length === 0
        ? 0
        : Math.max.apply(
            Math,
            products.map(function (o) {
              return o.id
            })
          )
    product.id = maxCode + 1
    products.push(product)
    await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8')
  }

  async getProducts() {
    try {
      const productos = await fs.promises.readFile(this.path, 'utf-8')
      const parsedProducts = JSON.parse(productos)
      return parsedProducts
    } catch (error) {
      console.log('No hay productos')
      return []
    }
  }

  async getProductById(id) {
    const products = await this.getProducts()
    const product = products.find(
      (product) => Number(product.id) === Number(id)
    )
    if (product) {
      return product
    } else {
      console.log('Id no existe')
    }
  }

  async updateProduct(id, newProduct) {
    const products = await this.getProducts()
    const product = products.find((product) => product.id === Number(id))
    if (newProduct.title) product.title = newProduct.title
    if (newProduct.description) product.description = newProduct.description
    if (newProduct.price) product.price = newProduct.price
    if (newProduct.thumbnail) product.thumbnail = newProduct.thumbnail
    if (newProduct.code) product.code = newProduct.code
    if (newProduct.stock) product.stock = newProduct.stock
    if (newProduct.status) product.status = newProduct.status
    if (newProduct.category) product.category = newProduct.category
    await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8')
  }

  async deleteProduct(id) {
    const products = await this.getProducts()
    const product = products.find((product) => product.id === Number(id))
    if (product) {
      const newProd = products.filter((prod) => prod.id !== Number(id))
      await fs.promises.writeFile(this.path, JSON.stringify(newProd), 'utf-8')
    } else {
      console.log('Id no existe')
    }
  }
}

