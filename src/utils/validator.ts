import { IUserDocument } from '../models/User'
import validator from 'validator'

interface UserRegisterError extends Partial<IUserDocument> {
  confirmPassword?: string
}
export const validateUserRegister = (username: IUserDocument['username'], password: IUserDocument['password'], confirmPassword: IUserDocument['password'], email: IUserDocument['email']) => {
  let errors: UserRegisterError = {}
  if (validator.isEmpty(username)) {
    errors.username = 'Username cannot be empty'
  }
  if (validator.isEmpty(password)) {
    errors.password = 'Password cannot be empty'
  }
  if (validator.isEmpty(confirmPassword)) {
    errors.confirmPassword = 'ConfirmPassword cannot be empty'
  }
  if (!validator.equals(password, confirmPassword)) {
    errors.confirmPassword = 'Password and ConfirmPassword is not matched'
  }
  if (validator.isEmpty(email)) {
    errors.email = 'Email cannot be empty'
  }
  if (!validator.isEmail(email)) {
    errors.email = 'Email must be a valid email address'
  }
  return { errors, valid: Object.keys(errors).length < 1 }
}
