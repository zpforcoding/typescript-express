import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import User, { IUserDocument } from '../models/User'
import { HttpException } from '../exceptions/HttpException'
import { validateUserRegister } from '../utils/validator'

export const postRegister = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const { username, password, confirmPassword, email } = req.body
    const { errors, valid } = validateUserRegister(username, password, confirmPassword, email)
    if (!valid) {
      throw new HttpException(StatusCodes.UNPROCESSABLE_ENTITY, 'User register input error', errors)
    }
    const user = await User.findOne({ username })
    if (user) {
      throw new HttpException(StatusCodes.UNPROCESSABLE_ENTITY, 'Username is taken', {
        username: 'The username is taken',
      })
    }
    const newUser: IUserDocument = new User({
      username,
      email,
      password,
    })
    const resUser: IUserDocument = await newUser.save()
    console.log(resUser.username)
  } catch (error) {
    next(error)
  }
}
