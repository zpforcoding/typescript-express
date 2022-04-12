import express, { Express, Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'
import bodyParser from 'body-parser'
import { HttpException } from './exceptions/HttpException'
import errorMiddleware from './middlewares/error.middleware'
import * as UserController from './controller/user'
import * as PostController from './controller/post'
const app: Express = express()
const port: any = process.env.PORT || 6060

app.use(bodyParser.json())

app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Hello World',
  })
})
app.post('/users/login', UserController.postLogin)
app.post('/users/register', UserController.postRegister)
app.get('/posts', PostController.getPosts)

app.use((_req: Request, _res: Response, next: NextFunction) => {
  const error: HttpException = new HttpException(StatusCodes.NOT_FOUND, 'Router not found')
  next(error)
})

app.use(errorMiddleware)

const main = async () => {
  await mongoose.connect('mongodb://localhost:27017/tsexpress')
  app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`)
  })
}

main()
