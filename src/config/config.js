import dotenv from 'dotenv'

export const getVariables = (options) => {
const persistence = options.opts().persistence
dotenv.config()

return{
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminName: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    secret: process.env.SECRET,
    environment: process.env.NODE_ENV,
    persistence : persistence,
    gmail: process.env.GMAIL,
    jwt: process.env.JWT_COOKIE
}

}