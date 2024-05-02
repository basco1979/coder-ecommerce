import { userModel } from '../dao/models/user.model.js'
import { usersService } from '../dao/repositories/index.js'
import UserDTO from '../dtos/user.dto.js'
import moment from 'moment/moment.js'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'


export const getUsers= async(req, res) => {
  const users = await usersService.getUsers()
  let userlist = []
  users.forEach((doc) => {
    let user = new UserDTO({
      first_name : doc.first_name,
      last_name : doc.last_name,
      email : doc.email, 
      role: doc.role
    })
    userlist.push(user)
  })
  res.send(userlist)
}

//Change user role to premium and the other way round
export const userToPremium = async (req, res) => {
  const { uid } = req.params
  try {
    const user = await usersService.getUserById(uid)
    let x = 0
    user.documents.forEach((doc) => {
      if (doc.doctype.includes('profile')) {
        x += 1
      }
      if (doc.doctype.includes('accountstatement')) {
        x += 1
      }
      if (doc.doctype.includes('address')) {
        x += 1
      }
    })
    if (x === 3 && user.role === 'user') {
      user.role = 'premium'
      const result = await usersService.updateUser(uid, user)
      return res.send({ message: `User role updated to ${user.role} ` })
    }
    if (user.role === 'premium') {
      user.role = 'user'
      const result = await usersService.updateUser(uid, user)
      return res.send({ message: `User role updated to ${user.role} ` })
    } else {
      res.status(422).json({ error: 'Not enough documents for this action' })
    }
  } catch (error) {
    req.logger.error(
      `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()} - Error to update user`
    )
  }
}

export const postDocument = async (req, res) => {
  if (!req.file)
    return res.status(400).send({ status: 'error', error: 'Cannot save file' })
  let { uid } = req.params
  const user = await userModel.findOne({ _id: uid })
  const newDoc = {
    name: req.file.filename,
    reference: req.file.path,
    doctype: req.file.fieldname,
  }
  user.documents.push(newDoc)
  const updatedUser = await usersService.updateUser(uid, user)
  res.send({ status: 'success', data: updatedUser })
}

export const deleteUsers = async(req, res) => {
  const users = await usersService.getUsers()
  let message = ""
users.forEach((user) => {
  if(user.last_connection <  moment().subtract(2, "days").valueOf()) {
  const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
      user: 'basco79@gmail.com',
      pass: process.env.gmail,
    },
  })
  try {
    const result = transport.sendMail({
      from: 'Sebastian Basconcelo <basco79@gmail.com>',
      to: user.email,
      subject: 'User deleted',
      html: `
                <div>
                    <h1>Hi!</h1>
                <p>Your user account has been deleted as it has not been connected for more than 2 days</p>
                </div>
            `,
      attachments: [],
    })
    usersService.deleteUser(user._id);
    message =  'Mail sent'
  } catch (error) {
    console.log(error)
   message= 'Could not send the email'
}
  }
  else{
    message = "No accounts have been deleted"
  }
  })
  res.send({message})
  }


export const deleteUser = async(req, res) => {
  const id = req.params.uid;
  const user = await usersService.getUserById(id)

  const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
      user: 'basco79@gmail.com',
      pass: process.env.gmail,
    },
  })
  try {
    const result = transport.sendMail({
      from: 'Sebastian Basconcelo <basco79@gmail.com>',
      to: user.email,
      subject: 'User deleted',
      html: `
                <div>
                    <h1>Hi!</h1>
                <p>Your user account has been deleted</p>
                </div>
            `,
      attachments: [],
    })
    usersService.deleteUser(user._id);
  res.send({message : 'User deleted. Mail sent' })
    
  } catch (error) {
    console.log(error)
   message= 'Could not send the email'
}
  }

