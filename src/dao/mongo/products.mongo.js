import { productModel } from '../models/product.model.js'

export default class Products {
  constructor() {}

  getProducts = async () => {
    const products = await productModel.find()
    return products
  }

  getProductById = async (id) => {
      const result = await productModel.findOne({ _id: id })
      return result
  }

  
  getProductByCode = async (code) => {
      const result = await productModel.findOne({ code: code })
      return result
  }

  saveProduct = async (product) => {
      const result = await productModel.create(product)
      return result
  }

  updateProduct = async (id, product) => {
    try {
      const result = await productModel.findOneAndUpdate({ _id: id }, product)
      return true
    } catch (error) {
      return false
    }
  }

  deleteProduct = async (id) => {
    try {
      const result = await productModel.deleteOne({ _id: id })
      return true
    } catch (error) {
      return false
    }
  }
}
