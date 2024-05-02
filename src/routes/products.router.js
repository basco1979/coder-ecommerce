import { Router } from "express";
import { applyPolicies} from '../middlewares/auth.js'
import {
  deleteProduct,
  getProductById,
  getProducts,
  createProduct,
  updateProduct,
} from "../controllers/products.controller.js";

const productsRouter = Router();

productsRouter.get("/", applyPolicies(['PUBLIC']), getProducts);
productsRouter.get("/:pid", applyPolicies(['PUBLIC']), getProductById);
productsRouter.post("/",  applyPolicies(['ADMIN','PREMIUM']), createProduct);
productsRouter.put("/:pid", applyPolicies(['ADMIN', 'PREMIUM']), updateProduct);
productsRouter.delete("/:pid",  applyPolicies(['ADMIN', 'PREMIUM']),deleteProduct);

export default productsRouter;