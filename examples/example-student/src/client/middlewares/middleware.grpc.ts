import * as grpc from '@grpc/grpc-js'
import { StudentClient } from '../../typedefs/mahasiswa_grpc_pb'
export const grpcClient = (): StudentClient => new StudentClient('localhost:30000', grpc.credentials.createInsecure())
