import { Response } from 'express'
import * as streambox from 'streambox-collection'

export const streamBox = (handler: Response, statusCode: number, data: Record<string, any>): void => {
	streambox.object({ ...data }).then((res: Buffer) => {
		return handler.status(statusCode).json(streambox.toObject(res))
	})
}
