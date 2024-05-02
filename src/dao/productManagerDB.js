import { productModel } from "./models/product.model.js"

export default class ProductManagerDB {
  constructor() {
  }


  async addProduct(product) {
    return await productModel.create(product)
  }

  async getProducts() {
      const productos = await productModel.find()
      return productos
  }

  async getProductById(id) {
    const product = await productModel.findById({_id : id})
    if (product) {
      return product
    } else {
      console.log('Id no existe')
    }
  }

  async updateProduct(id, newProduct) {
    const product = await productModel.updateOne({_id : id}, newProduct)
    return product
  }

  async deleteProduct(id) {
    const product = await productModel.deleteOne({_id : id})
    return product
  }

}