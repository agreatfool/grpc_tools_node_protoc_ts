import { Express } from 'express'
import studentRoute from '../routes/route.mhs'

export const routeMiddleware = (app: Express): void => {
	app.use('/api/v1', studentRoute)
}
