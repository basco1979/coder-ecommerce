import { userNotFound } from '../../services/errors/info.js'
import { userModel } from '../models/user.model.js'

export default class Users {
  constructor() {}

  getUsers = async () => {
    const users = await userModel.find()
    return users
  }

  getUserBy =  (params) => {
    return userModel.findOne( params )
  }

  saveUser = async (user) => {
    try {
      const result = await userModel.create(user)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  updateUser = async (id, user) => {
    try {
      const result = await userModel.findOneAndUpdate({ _id: id }, user)
      return true
    } catch (error) {
      return false
    }
  }

  delete = async (id) => {
    try {
      const result = await userModel.deleteOne({ _id: id })
      return true
    } catch (error) {
      return false
    }
  }
}
