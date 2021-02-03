import { Router } from 'express'
import { controller } from '../controllers/mahasiswa'

const router: Router = Router()

router.post('/mhs', controller.createStudent)
router.get('/mhs', controller.resultsStudent)
router.get('/mhs/:id', controller.resultStudent)
router.delete('/mhs/:id', controller.deleteStudent)
router.put('/mhs/:id', controller.updateStudent)

export default router
