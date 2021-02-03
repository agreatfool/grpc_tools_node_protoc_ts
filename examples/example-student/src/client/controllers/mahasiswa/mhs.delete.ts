import { Request, Response } from 'express'
import { ServiceError } from '@grpc/grpc-js'
import { grpcClient } from '../../middlewares/middleware.grpc'
import { StudentId, StudentResponse } from '../../../typedefs/mahasiswa_pb'
import { streamBox } from '../../utils/util.stream'

export const deleteStudent = (req: Request, res: Response): void => {
	const client = grpcClient()

	const params = new StudentId()
	params.setId(req.params.id)

	client.deleteStudent(params, (error: ServiceError, response: StudentResponse): void => {
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
