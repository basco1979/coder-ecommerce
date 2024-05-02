import passport from 'passport'
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { userModel } from '../dao/models/user.model.js'
import { cartModel } from '../dao/models/cart.model.js'
import { createHash, isValidPassword } from '../utils/bcrypt.js'
import dotenv from 'dotenv'
dotenv.config()

const LocalStrategy = local.Strategy

const cookieExtractor = (req) => {
  let token = null
  if (req && req.cookies) token = req.cookies[config.jwt]
  return token
}

const initializePassport = () => {
  passport.use(
    'register',
    new LocalStrategy(
      { passReqToCallback: true, usernameField: 'email' },
      async (req, username, password, done) => {
        const cart = {
          products: [],
        }
        const result = await cartModel.create(cart)
        const { first_name, last_name, email, age, role } = req.body
        try {
          const user = await userModel.findOne({ email: username })
          if (user) return done(null, false, 'Email already in use')
          const newUser = await userModel.create({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role,
            cartId: result._id,
          })
          return done(null, newUser)
        } catch (error) {
          return done('Error to obtain the user' + error)
        }
      }
    )
  )

  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email' },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username })
          if (!user) {
            return done(null, false, 'User doesn´t exists')
          }
          if (!isValidPassword(user, password)) {
            return done(null, false, 'Invalid Password')
          }
          return done(null, user)
        } catch (error) {
          return done(error)
        }
      }
    )
  )

  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/api/session/githubcallback',
      },
      async (accesToken, refreshToken, profile, done) => {
        try {
          let user = await userModel.findOne({ email: profile._json.email })
          if (!user) {
            let newUser = {
              first_name: profile._json.name
                ? profile._json.name
                : profile._json.login,
              last_name: ' ',
              age: 18,
              email: profile._json.email,
              password: ' ',
            }
            let result = await userModel.create(newUser)
            done(null, result)
          } else {
            done(null, user)
          }
        } catch (error) {
          return done(error)
        }
      }
    )
  )

  passport.use(
    'current',
    new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: process.env.SECRET,
    }, function (jwtPayload, done) {
      try {
        return done(null, jwtPayload)
      } catch (error) {
        return done(error)
      }
    })
  )

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findOne({ _id: id })
    done(null, user)
  })
}

export default initializePassport
