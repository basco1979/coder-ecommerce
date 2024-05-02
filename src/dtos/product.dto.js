class ProductDTO {
    constructor(product){
        this.title = product.title;
        this.price = product.price;
        this.description = product.description;
        this.thumbnail = product.thumbnail;
        this.code = product.code;
        this.stock = product.stock;
        this.status = product.status;
        this.category = product.category
        this.owner = product.owner
    }
}

export default ProductDTO;