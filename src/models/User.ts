import { Schema, model, Model, Document, CallbackWithoutResultAndOptionalError, Query } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { JwtPayload } from '../types/Jwt'

enum Role {
  basic = 'basic',
  admin = 'admin',
}

interface Address {
  city: string
  street: string
}

interface IUserModel extends Model<IUserDocument> {
  admin: () => Query<IUserDocument | null, IUserDocument, {}>
  orderByNameDesc: () => Query<
    (IUserDocument & {
      _id: any
    })[],
    IUserDocument & {
      _id: any
    },
    {},
    IUserDocument
  >
}

export interface IUserDocument extends Document {
  username: string
  email: string
  password: string
  _doc: IUserDocument
  role: string
  address: Address[]
  generateToken: () => string
}

const addressSchema: Schema = new Schema({
  city: String,
  street: String,
})

const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'User must not be empty'],
    },
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
      },
    },
    role: {
      type: String,
      enum: ['basic', 'admin'],
      default: Role.basic,
    },
    password: String,
    createdAt: String,
    address: { type: [addressSchema] },
  },
  { timestamps: true }
)
// 定义返回token的方法
userSchema.methods.generateToken = function (): string {
  const payload: JwtPayload = { id: this.id }
  return jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
    expiresIn: '1h',
  })
}

userSchema.static('admin', (): Query<IUserDocument | null, IUserDocument, {}> => {
  return User.findOne({ username: 'aa1111' })
})

userSchema.static('orderByNameDesc', (): Query<(IUserDocument & { _id: any })[], IUserDocument & { _id: any }, {}, IUserDocument> => {
  return User.find({}).sort({ username: -1 })
})

// 在存储之前，将password加密
userSchema.pre<IUserDocument>('save', async function save(next: CallbackWithoutResultAndOptionalError) {
  if (!this.isModified('password')) {
    return next()
  }
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10)
    this.password = hashedPassword
  } catch (error) {
    next(error)
  }
})

const User: IUserModel = model<IUserDocument, IUserModel>('User', userSchema)

export default User
