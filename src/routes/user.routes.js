import { Router } from 'express'
import { userToPremium, postDocument, getUsers, deleteUsers, deleteUser } from '../controllers/users.controller.js'
import { uploadProfile, uploadAccountStatement, uploadAddres, uploadProduct } from '../utils/multer.js'
//import { applyPolicies } from '../middlewares/auth.js'

const usersRouter = Router()

usersRouter.get('/',  getUsers)
usersRouter.delete('/', deleteUsers)
usersRouter.delete('/:uid', deleteUser)
usersRouter.post('/premium/:uid', userToPremium)
usersRouter.post('/:uid/documents/profile',uploadProfile, postDocument)
usersRouter.post('/:uid/documents/product',uploadProduct, postDocument)
usersRouter.post('/:uid/documents/accountstatement',uploadAccountStatement, postDocument)
usersRouter.post('/:uid/documents/address',uploadAddres, postDocument)

export default usersRouter