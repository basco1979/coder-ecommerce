import ProductDTO from '../../dtos/product.dto.js'

export default class ProductRepository {
  constructor(dao) {
    this.dao = dao
  }

  getProducts = () => {
    const result = this.dao.getProducts()
    return result
  }

  getProductById = async (id) => {
    const product = await this.dao.getProductById(id) 
    if (product) {
      return product
    } else {
      console.log('Id does not exists')
    }
  }

  getProductByCode = async (code) => {
    const product = await this.dao.getProductByCode(code) 
    if (product) {
      return product
    } else {
      console.log('Id does not exists')
    }
  }

  createProduct = async (product) => {
    const newProduct = new ProductDTO(product);
    const result = this.dao.saveProduct(newProduct)
    return result
  }

  updateProduct = async (id, product) => {
    const productUpdated = await this.dao.updateProduct(id, product)
    return productUpdated  
  }
  deleteProduct  = async (id) => {
   const product = await this.dao.deleteProduct(id)
   return product
  }
  }
