import { Schema, model, Model, Document } from 'mongoose'

export interface IUserDocument extends Document {
  username: string
  email: string
  password: string
  createAt: string
}

const userSchema: Schema = new Schema({
  username: String,
  email: String,
  password: String,
  createdAt: String,
})
const User: Model<IUserDocument> = model<IUserDocument>('User', userSchema)

export default User
