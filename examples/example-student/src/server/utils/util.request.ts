import { StudentRequest as Request } from '../../typedefs/mahasiswa_pb'
import { StudentDTO } from '../dto/dto.mhs'

function StudentsResponse({ id, name, npm, fak, bid, createdAt, updatedAt }: Request.AsObject): Request {
	const studentRequest = new Request()
	studentRequest.setId(id)
	studentRequest.setName(name)
	studentRequest.setNpm(npm)
	studentRequest.setFak(fak)
	studentRequest.setBid(bid)
	studentRequest.setCreatedAt(new Date(createdAt).toISOString())
	studentRequest.setUpdatedAt(new Date(updatedAt).toISOString())

	return studentRequest
}

// function StudentResponse({ id, name, npm, fak, bid, createdAt, updatedAt }: Reponse.AsObject, Res: Reponse): Reponse {
// 	Res.setId(id)
// 	Res.setName(name)
// 	Res.setNpm(npm)
// 	Res.setFak(fak)
// 	Res.setBid(bid)
// 	Res.setCreatedAt(new Date(createdAt).toISOString())
// 	Res.setUpdatedAt(new Date(updatedAt).toISOString())

// 	return Res
// }

export const studentsResponse = (results: StudentDTO[]): Request[] =>
	results.map((results: StudentDTO) => StudentsResponse(results))

// export const studentResponse = (result: StudentDTO, Res: Reponse): Reponse => StudentResponse(result, Res)
