import { Request, Response, NextFunction } from 'express'
import { HttpException } from '../exceptions/HttpException'

const errorMiddleware = (err: HttpException, _req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500
  const message = err.message || 'Something is wrong'
  res.status(status).send({
    status,
    message,
    errors: err.errors,
  })
  next()
}

export default errorMiddleware
