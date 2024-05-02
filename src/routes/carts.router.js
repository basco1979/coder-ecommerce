import { Router } from 'express'
import { applyPolicies} from '../middlewares/auth.js'
import { deleteCart, deleteProductInCart, getCartById, saveCart, postProductInCart, putCart, putProductInCart, purchaseCart } from '../controllers/carts.controller.js'

const cartsRouter = Router()

cartsRouter.post('/', applyPolicies(['USER', 'PREMIUM']), saveCart)

cartsRouter.get('/:cid', applyPolicies(['USER', 'PREMIUM']), getCartById)

cartsRouter.post('/:cid/product/:pid', applyPolicies(['USER', 'PREMIUM']), postProductInCart)

cartsRouter.delete('/:cid/product/:pid', applyPolicies(['USER', 'PREMIUM']), deleteProductInCart)

cartsRouter.put('/:cid', applyPolicies(['USER', 'PREMIUM']), putCart)

cartsRouter.put('/:cid/product/:pid', applyPolicies(['USER', 'PREMIUM']), putProductInCart)

cartsRouter.put('/:cid/purchase', applyPolicies(['USER', 'PREMIUM']), purchaseCart)

cartsRouter.delete('/:cid', applyPolicies(['USER', 'PREMIUM']), deleteCart)

export default cartsRouter