import 'dotenv/config'
import { Express } from 'express'
import zlib from 'zlib'
import bodyParser from 'body-parser'
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet'
import morgan from 'morgan'

export const pluginMiddleware = (app: Express): void => {
	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(cors())
	app.use(helmet())
	app.use(
		compression({
			level: 9,
			strategy: zlib.constants.Z_RLE
		})
	)
	app.use(morgan('dev'))
}
