import MongoStore from 'connect-mongo';
import express from "express";
import cors from 'cors'
import session from 'express-session';
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import __dirname from "../utils.js";
import mongoose from "mongoose";
import { messageModel } from "./dao/models/message.model.js";
import passport from 'passport';
import initializePassport from './config/passport.config.js';
//import { getVariables } from './config/config.js';
import cartsRouter from './routes/carts.router.js';
import sessionRouter from './routes/session.routes.js';
import productsRouter from './routes/products.router.js';
import viewsRouter from './routes/views.router.js';
import ticketsRouter from './routes/tickets.routes.js';
import mockingRouter from './routes/mocking.routes.js';
//import { Command } from 'commander'
//import { ErrorHandler } from './middlewares/error.js';
import compression from 'express-compression';
import { addLogger } from './utils/logger.js';
import methodOverride from 'method-override'
import usersRouter from './routes/user.routes.js';
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'
import paymentRouter from './routes/payments.routes.js';
import dotenv from 'dotenv'
dotenv.config()

const app = express();
//const program = new Command()
//program.option('--persistence <persistence>')
//const options = program.parse()
//const { mongoUrl, secret } = getVariables(options)

const PORT = process.env.PORT || 8080 
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(compression({
    brotli: {enabled: true, zlib: {}}
}));

app.use(session({
    secret: process.env.SECRET,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
    }),
    resave: true,
    saveUninitialized: true
}));

initializePassport();
app.use(passport.initialize())
app.use(passport.session())

const hbs = handlebars.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    },
})

// register new handlebars function
hbs.handlebars.registerHelper('isAdmin', function(role) {
  return role === 'admin';
})

app.engine("handlebars", hbs.engine);
app.set("views", "src/views");
app.set("view engine", "handlebars");

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

//Swagger
const swaggerOptions = {
    definition : {
        openapi: '3.0.1',
        info: {
            title: 'Ecommerce',
            description: 'API  for Ecommerce application'
        }
    },
    apis: [`${__dirname}/src/docs/**/*.yaml`]
}

const specs = swaggerJsdoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))


//Logger
app.use(addLogger)
app.get('/loggerTest', (req, res) =>{
    req.logger.info(`${new Date().toLocaleTimeString()} -Info message`)
    req.logger.warning(`${new Date().toLocaleTimeString()} -Warning message`)
    req.logger.error(`${new Date().toLocaleTimeString()} -Error message`)
    req.logger.fatal(`${new Date().toLocaleTimeString()} -Fatal message`)
    res.send({message: "Error"})
})
//Routing
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use('/api/session', sessionRouter);
app.use('/api/tickets', ticketsRouter)
app.use('/mockingproducts', mockingRouter)
app.use('/api/users',  usersRouter)
app.use('/api/payments', paymentRouter)
//app.use(ErrorHandler)

mongoose.connect(process.env.MONGO_URL)

const httpServer = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

//WebSockets
const io = new Server(httpServer)
io.on('connect', socket => {
    console.log("Nuevo Cliente Conectado")
    socket.on('message', async (data) => {
        messageModel.create(data)
        io.emit('messageLogs', await messageModel.find())
    });
    
    socket.on('newUser', user => {
        io.emit('newConnection', "Un nuevo usuario se conecto")
        socket.broadcast.emit('notification', user)
    })
})
