import { Request, Response } from 'express'
import { ServiceError } from '@grpc/grpc-js'
import { grpcClient } from '../../middlewares/middleware.grpc'
import { StudentId, StudentResponse } from '../../../typedefs/mahasiswa_pb'
import { streamBox } from '../../utils/util.stream'

export const resultStudent = (req: Request, res: Response): void => {
	const client = grpcClient()

	const params = new StudentId()
	params.setId(req.params.id)

	client.resultStudent(params, (error: ServiceError, response: StudentResponse): void => {
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
				message: response.getMessage(),
				student: {
					id: response.getId(),
					name: response.getName(),
					npm: response.getNpm(),
					fak: response.getFak(),
					bid: response.getBid(),
					createdAt: response.getCreatedAt(),
					updatedAt: response.getUpdatedAt()
				}
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
