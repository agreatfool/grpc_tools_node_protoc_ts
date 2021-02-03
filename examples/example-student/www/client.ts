import express from 'express'
import { pluginMiddleware } from '../src/client/middlewares/middleware.plugin'
import { routeMiddleware } from '../src/client/middlewares/middleware.route'

const app: express.Express = express()
pluginMiddleware(app)
routeMiddleware(app)

app.listen(process.env.PORT, () => console.log(`client is running on ${process.env.PORT}`))
