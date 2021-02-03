import { Request, Response } from 'express'
import { ServiceError } from '@grpc/grpc-js'
import { Empty } from 'google-protobuf/google/protobuf/empty_pb'
import { grpcClient } from '../../middlewares/middleware.grpc'
import { StudentList } from '../../../typedefs/mahasiswa_pb'
import { streamBox } from '../../utils/util.stream'

export const resultsStudent = (req: Request, res: Response): void => {
	const client = grpcClient()

	client.resultsStudent(new Empty(), (error: ServiceError, response: StudentList): void => {
		if (error) {
			streamBox(res, response.getStatuscode(), {
				method: req.method,
				statusCode: response.getStatuscode(),
				message: response.getMessage()
			})
		}

		if (response !== undefined && response.toArray().length > 0) {
			streamBox(res, response.getStatuscode(), {
				method: req.method,
				statusCode: response.getStatuscode(),
				message: response.getMessage(),
				students: response.toObject().studentsList
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
