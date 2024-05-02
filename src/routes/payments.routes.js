import { Router } from "express";
import { paymentIntent } from "../controllers/payments.controller.js";

const paymentRouter = Router()

paymentRouter.post('/:tid', paymentIntent)

export default paymentRouter;