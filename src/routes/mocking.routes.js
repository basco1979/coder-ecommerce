import { Router } from "express";
import { generateProduct } from "../utils/faker.js";

const mockingRouter = Router();

mockingRouter.get('/', (req, res) => {
    const products = [];
    for(let i=0; i<100; i++){
        products.push(generateProduct());
    }
    res.send({satus: 'success', payload: products});
});

export default mockingRouter;