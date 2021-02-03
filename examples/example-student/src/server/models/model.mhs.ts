import * as mongoose from 'mongoose'
import shortId from 'shortid'
import { StudentDTO } from '../dto/dto.mhs'

const Schema: mongoose.Schema = new mongoose.Schema({
	id: {
		type: String,
		unique: true,
		trim: true,
		default: shortId()
	},
	name: {
		type: String,
		trim: true,
		required: [true, 'name is required']
	},
	npm: {
		type: String,
		trim: true,
		minlength: [12, 'nomor pokok mahasiswa minimum 12 character'],
		required: [true, 'nomor pokok mahasiswa is required']
	},
	fak: {
		type: String,
		trim: true,
		required: [true, 'fakultas is required']
	},
	bid: {
		type: String,
		trim: true,
		required: [true, 'bidang studi is required']
	},
	createdAt: {
		type: Date,
		default: new Date()
	},
	updatedAt: {
		type: Date,
		default: new Date()
	}
})

export const studentSchema = mongoose.model<StudentDTO>('student', Schema)
