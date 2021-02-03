import { Request, Response } from 'express'
import { ServiceError } from '@grpc/grpc-js'
import { grpcClient } from '../../middlewares/middleware.grpc'
import { StudentRequest, StudentResponse } from '../../../typedefs/mahasiswa_pb'
import { streamBox } from '../../utils/util.stream'

export const updateStudent = (req: Request, res: Response): void => {
	const client = grpcClient()

	const payloadBody = new StudentRequest()
	payloadBody.setId(req.params.id)
	payloadBody.setName(req.body.name)
	payloadBody.setNpm(req.body.npm)
	payloadBody.setFak(req.body.fak)
	payloadBody.setBid(req.body.bid)

	client.updateStudent(payloadBody, (error: ServiceError, response: StudentResponse): void => {
		if (error) {
			streamBox(res, response.getStatuscode(), {
				method: req.method,
				statusCode: response.getStatuscode(),
				message: response.getMessage()
			})
		}

		if (response !== undefined && response.getId() !== '') {
			streamBox(res, response.getStatuscode(), {
				method: req.method,
				statusCode: response.getStatuscode(),
				message: response.getMessage()
			})
		} else {
			streamBox(res, response.getStatuscode(), {
				method: req.method,
				statusCode: response.getStatuscode(),
				message: response.getMessage()
			})
		}
	})
}
