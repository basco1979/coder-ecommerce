import { Router } from 'express'
import passport from 'passport'
import { applyPolicies} from '../middlewares/auth.js'
import { adminProducts, currentUser, login, register, logout, restorePassword, sendEmailToRestorePassword, getUserById } from '../controllers/session.controller.js';

const sessionRouter = Router()

    sessionRouter.post(
      '/login',
      passport.authenticate('login', { failureRedirect: '/faillogin' }),
      login
    )

    sessionRouter.post(
      '/register',
      passport.authenticate('register', { failureRedirect: '/failregister' }),
     register
    )

sessionRouter.get('/github', passport.authenticate('github', {scope: ['user:email']}), async(req, res)=> {})
sessionRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async(req, res)=> {
    req.session.user = req.user
    res.redirect('/')
})

sessionRouter.post('/logout', logout);

sessionRouter.post('/restore-password', restorePassword)

sessionRouter.post('/send-email', sendEmailToRestorePassword)

sessionRouter.get('/current', applyPolicies(['ADMIN', 'USER', 'PREMIUM']), currentUser)

sessionRouter.get('/admin', applyPolicies(['ADMIN']) , adminProducts)

sessionRouter.get('/get-user/:uid', getUserById)

//sessionRouter.post('/current', passport.authenticate('current', {session: false}), getCurrentUser) 

export default sessionRouter;

