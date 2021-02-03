import { Document } from 'mongoose'

export interface StudentDTO extends Document {
	id: string
	name: string
	npm: string
	bid: string
	fak: string
	createdAt: any
	updatedAt: any
}
