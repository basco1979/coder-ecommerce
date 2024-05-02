export default class Carts {
    constructor(){
        this.carts = [];
    }

    get = () => {
        return this.carts;
    }

    post = (cart) => {
        this.carts.push(cart);
        return true;
    }
}