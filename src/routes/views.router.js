import { Router } from "express";
import { checkAuth, checkExistingUser,applyPolicies } from "../middlewares/auth.js";
import {
  getCartDetailPage,
  getChatPage,
  getFailLoginPage,
  getFailRegisterPage,
  getIndexPage,
  getLoginPage,
  getProductsPage,
  getRegisterPage,
  restorePassword,
  createProductPage,
  updateProductPage,
  deleteProductPage,
  sendEmail,
  usersPage,
  updateUserRolPage,
  deleteUserPage,
  getCheckoutPage,
  getPaymentPage
} from "../controllers/views.controller.js";
import { postProductInCart, deleteCart, deleteProductInCart, increaseQuantityProductInCart, decreaseQuantityProductInCart } from "../controllers/carts.controller.js";

const viewsRouter = Router();
viewsRouter.get("/", checkAuth, getIndexPage);

viewsRouter.get("/login", checkExistingUser, getLoginPage);

viewsRouter.get("/register", checkExistingUser, getRegisterPage);

viewsRouter.get("/chat", applyPolicies(['USER', 'PREMIUM']), getChatPage);

viewsRouter.get("/products", applyPolicies(['ADMIN', 'USER', 'PREMIUM']), getProductsPage);

viewsRouter.get("/:cid/add/:pid",  applyPolicies(['USER', 'PREMIUM']), postProductInCart);

viewsRouter.get("/:cid/addQuantity/:pid",  applyPolicies(['USER', 'PREMIUM']), increaseQuantityProductInCart);

viewsRouter.get("/:cid/removeQuantity/:pid",  applyPolicies(['USER', 'PREMIUM']), decreaseQuantityProductInCart);

viewsRouter.get("/:cid/delete/:pid",  applyPolicies(['USER', 'PREMIUM']), deleteProductInCart);

viewsRouter.get("/cart/:cid", applyPolicies(['USER', 'PREMIUM']), getCartDetailPage);

viewsRouter.get("/cart/:cid/checkout", applyPolicies(['USER', 'PREMIUM']), getCheckoutPage);

viewsRouter.get("/cart/:cid/payment/:tid", applyPolicies(['USER', 'PREMIUM']), getPaymentPage);



viewsRouter.get(
  "/restore-password",
  restorePassword
);

viewsRouter.get(
  "/send-email",
  sendEmail
);

viewsRouter.get("/failregister", getFailRegisterPage);

viewsRouter.get("/faillogin", getFailLoginPage);

viewsRouter.get("/create-product", applyPolicies(['ADMIN', 'PREMIUM']), createProductPage);
viewsRouter.get("/update-product/:pid", applyPolicies(['ADMIN', 'PREMIUM']), updateProductPage);
viewsRouter.get("/delete-product", applyPolicies(['ADMIN', 'PREMIUM']), deleteProductPage);

viewsRouter.get("/view-users", applyPolicies(['ADMIN']), usersPage);
viewsRouter.get("/update-role/:pid", applyPolicies(['ADMIN']), updateUserRolPage);
viewsRouter.get("/delete-user", applyPolicies(['ADMIN']), deleteUserPage)


export default viewsRouter;
