import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import User, { IUserDocument } from '../models/User'
import { HttpException } from '../exceptions/HttpException'
import { UserLoginError, validateUserLogin, validateUserRegister } from '../utils/validator'
import bcrypt from 'bcryptjs'

const throwValidateError = (errors: UserLoginError) => {
  throw new HttpException(StatusCodes.UNPROCESSABLE_ENTITY, 'User login input error', errors)
}

/**
 * 登录
 */
export const postLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password } = req.body
    const { errors, valid } = validateUserLogin(username, password)
    console.log(username, password)
    if (!valid) {
      return throwValidateError(errors)
    }
    const user = await User.findOne({ username })

    if (!user) {
      errors.general = 'User not found'
      return throwValidateError(errors)
    }
    console.log(user)
    const match = await bcrypt.compare(password, user.password)
    console.log(match)
    if (!match) {
      errors.general = 'Wrong credencials'
      return throwValidateError(errors)
    }
    const token = user.generateToken()
    res.json({
      success: true,
      data: {
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * 注册
 */
export const postRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password, confirmPassword, email, role } = req.body
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
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser: IUserDocument = new User({
      username,
      email,
      role,
      password: hashedPassword,
    })
    const admin = await User.admin()
    const users = await User.orderByNameDesc()
    console.log(admin)
    console.log(users)
    const resUser: IUserDocument = await newUser.save()
    const token = resUser.generateToken()
    res.json({
      success: true,
      data: {
        token,
        user: resUser,
      },
    })
  } catch (error) {
    next(error)
  }
}
