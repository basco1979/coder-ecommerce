import { Router } from "express";
import { paymentIntent } from "../controllers/payments.controller.js";

const paymentRouter = Router()

paymentRouter.post('/', paymentIntent)

export default paymentRouter;