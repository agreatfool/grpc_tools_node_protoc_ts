import { ServerUnaryCall as UnaryCall, sendUnaryData as UnaryData } from '@grpc/grpc-js'
import { Empty } from 'google-protobuf/google/protobuf/empty_pb'
import { IStudentServer } from '../../typedefs/mahasiswa_grpc_pb'
import { StudentRequest, StudentResponse, StudentList, StudentId } from '../../typedefs/mahasiswa_pb'
import { studentSchema } from '../models/model.mhs'
import { StudentDTO } from '../dto/dto.mhs'
import { studentsResponse } from '../utils/util.request'

export const StudentSeviceImplementation: IStudentServer = {
	insertStudent: (call: UnaryCall<StudentRequest, StudentResponse>, callback: UnaryData<StudentResponse>) => {
		const studentResponse = new StudentResponse()

		studentSchema.find({ $or: [{ npm: call.request.getNpm() }] }, (error: any, results: StudentDTO[]) => {
			if (error) {
				studentResponse.setStatuscode(500)
				studentResponse.setMessage('Internal Server Error')
				callback(null, studentResponse)
			}

			if (results.length > 0) {
				studentResponse.setStatuscode(409)
				studentResponse.setMessage('student already exist')
				callback(null, studentResponse)
			} else {
				const saveUser = studentSchema.create({
					name: call.request.getName(),
					npm: call.request.getNpm(),
					fak: call.request.getFak(),
					bid: call.request.getBid(),
					created_at: call.request.getCreatedAt()
				})

				if (saveUser) {
					studentResponse.setStatuscode(201)
					studentResponse.setMessage('add new student successfully')
					callback(null, studentResponse)
				} else {
					studentResponse.setStatuscode(403)
					studentResponse.setMessage('add new student failed')
					callback(null, studentResponse)
				}
			}
		})
	},
	resultsStudent: (call: UnaryCall<Empty, Empty>, callback: UnaryData<StudentList>) => {
		const studentsList = new StudentList()

		studentSchema.find({}, (error: any, results: StudentDTO[]) => {
			if (error) {
				studentsList.setStatuscode(500)
				studentsList.setMessage('internal server error')
				callback(null, studentsList)
			}

			if (results.length > 0) {
				studentsList.setStudentsList(studentsResponse(results))
				studentsList.setStatuscode(200)
				studentsList.setMessage('student data already to use')
				callback(null, studentsList)
			} else {
				studentsList.setStatuscode(404)
				studentsList.setMessage('student data is not exist, or deleted from owner')
				callback(null, studentsList)
			}
		})
	},
	resultStudent: (call: UnaryCall<StudentId, StudentResponse>, callback: UnaryData<StudentResponse>) => {
		const studentResponse = new StudentResponse()

		studentSchema.findOne({ id: call.request.getId() }, (error: any, result: StudentDTO) => {
			if (error) {
				studentResponse.setStatuscode(500)
				studentResponse.setMessage('internal server error')
				callback(null, studentResponse)
			}

			if (result) {
				studentResponse.setId(result.id)
				studentResponse.setName(result.name)
				studentResponse.setNpm(result.npm)
				studentResponse.setFak(result.fak)
				studentResponse.setBid(result.bid)
				studentResponse.setCreatedAt(new Date(result.createdAt).toISOString())
				studentResponse.setUpdatedAt(new Date(result.updatedAt).toISOString())
				studentResponse.setStatuscode(200)
				studentResponse.setMessage('student data already to use')
				callback(null, studentResponse)
			} else {
				studentResponse.setStatuscode(404)
				studentResponse.setMessage('student data is not exist, or deleted from owner')
				callback(null, studentResponse)
			}
		})
	},
	deleteStudent: (call: UnaryCall<StudentId, StudentResponse>, callback: UnaryData<StudentResponse>) => {
		const studentResponse = new StudentResponse()

		studentSchema.findOne({ id: call.request.getId() }, (error: any, result: StudentDTO) => {
			if (error) {
				studentResponse.setStatuscode(500)
				studentResponse.setMessage('internal server error')
				callback(error, studentResponse)
			}

			if (result) {
				studentSchema.deleteOne({ id: result.id }, {}, (error: any) => {
					if (error) {
						studentResponse.setStatuscode(500)
						studentResponse.setMessage('internal server error')
						callback(null, studentResponse)
					}

					studentResponse.setStatuscode(200)
					studentResponse.setMessage('student data successfully to deleted')
					callback(null, studentResponse)
				})
			} else {
				studentResponse.setStatuscode(404)
				studentResponse.setMessage('student data is not exist, or deleted from owner')
				callback(null, studentResponse)
			}
		})
	},
	updateStudent: (call: UnaryCall<StudentRequest, StudentResponse>, callback: UnaryData<StudentResponse>) => {
		const studentResponse = new StudentResponse()

		studentSchema.findOne({ id: call.request.getId() }, (error: any, result: StudentDTO) => {
			if (error) {
				studentResponse.setStatuscode(500)
				studentResponse.setMessage('internal server error')
				callback(error, studentResponse)
			}

			if (result) {
				studentSchema.updateOne(
					{ id: call.request.getId() },
					{
						$set: {
							name: call.request.getName(),
							npm: call.request.getNpm(),
							fak: call.request.getFak(),
							bid: call.request.getBid(),
							updatedAt: new Date()
						}
					},
					{},
					(error: any, result: StudentDTO) => {
						if (error) {
							studentResponse.setStatuscode(500)
							studentResponse.setMessage('internal server error')
							callback(null, studentResponse)
						}

						if (result) {
							studentResponse.setStatuscode(200)
							studentResponse.setMessage('student data successfully to updated')
							callback(null, studentResponse)
						} else {
							studentResponse.setStatuscode(200)
							studentResponse.setMessage('student data failed to updated')
							callback(null, studentResponse)
						}
					}
				)
			} else {
				studentResponse.setStatuscode(404)
				studentResponse.setMessage('student data is not exist, or deleted from owner')
				callback(null, studentResponse)
			}
		})
	}
}
