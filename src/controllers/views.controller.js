import { productModel } from "../dao/models/product.model.js";
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { cartsService, ticketsService, usersService } from "../dao/repositories/index.js";

dotenv.config()

export const getIndexPage = (req, res) => {
  const { user } = req.session;
  res.render("index", user);
};

export const getLoginPage = (req, res) => {
  res.render("login");
};

export const getRegisterPage = (req, res) => {
  res.render("register");
};

export const getChatPage = async (req, res) => {
  res.render("chat", { title: "Chat", style: "chat.css" });
};

export const getProductsPage = async (req, res) => {
  const { first_name, last_name, role, cartId } = req.session.user;
  let { page } = req.query;
  if (!page || isNaN(Number(page))) page = 1;
  const products = await productModel.paginate({}, { limit: 10, page: page });
  products.prevLink = `/products/?page=${Number(page) - 1}`;
  products.nextLink = `/products/?page=${Number(page) + 1}`;
  res.render("products", {
    first_name,
    last_name,
    role,
    cartId,
    products,
    cartId,
    title: "Products",
    style: "products.css",
  });
};

export const getCartDetailPage = async (req, res) => {
  const { cid } = req.params;
  const cart = await cartsService.getCartById(cid)
  let subtotal = 0
  cart.products.forEach(item =>{
  let result = item.quantity * item.product.price
  subtotal += result
  })
  let total = subtotal.toFixed(2)
  if (cart) {
    if (cart.products.length < 1) {
      res.send({ message: "Empty Cart" });
    } else {
      res.render("cart", { cart, total });
    }
  } else res.status(404).send({ error: "Cart not found" });
};

export const getCheckoutPage = async(req, res) => {
  const cid = req.params.cid
  const ticket = await cartsService.purchaseCart(cid)
  const cart = await cartsService.getCartById(cid)

  res.render('checkout', {ticket, cart})
}

export const getPaymentPage = async(req, res) => {
  const tid = req.params.tid
  const ticket = await ticketsService.getTicketById(tid)
  const user = req.user
  res.render('payment', {ticket, user})
}

export const restorePassword = (req, res) => {
  let {email, token} = req.query
  try{
  jwt.verify(token, process.env.SECRET, function(err, decoded) {
  if (err) {
    return res.redirect('send-email')
  }
  else{
    return res.render('restore-password', {email, token})
  }
});
  }catch(err){console.log(err)}
  }

export const sendEmail = (req, res) => {
  res.render("send-email");
};

export const getFailRegisterPage = (req, res) => {
  res.render("failregister");
};

export const getFailLoginPage = (req, res) => {
  res.render("faillogin");
};

export const createProductPage = (req, res) => {
  res.render("create-product");
};

export const updateProductPage = async (req, res) => {
  const { pid } = req.params;
  try{
  const product = await productModel.findOne({ _id: pid });
  res.render("update-product", product);
  }
  catch(err){
    req.logger.error(`${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()} - "Error" `, err)
  }
};

export const deleteProductPage = (req, res) => {
  res.render("delete-product");
};


export const usersPage = async (req, res) => {
  const users = await usersService.getUsers()
  res.render("users", {users});
};

export const updateUserRolPage = (req, res) => {
  res.render("users-role");
};

export const deleteUserPage = (req, res) => {
  res.render("delete-user");
};
