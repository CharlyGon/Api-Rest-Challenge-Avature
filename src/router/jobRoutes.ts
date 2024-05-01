import express from 'express';
import { createJobController, getJobByIdController,  updateJobByIdController } from '../controllers/jobControllers';
import { listCombinedJobsController } from '../controllers/combinedJobsControllers';

const router = express.Router();

router.get('/',listCombinedJobsController)
router.get('/:id',getJobByIdController)
router.post('/', createJobController);
router.put('/:id', updateJobByIdController);
router.delete('/:id', updateJobByIdController);

export default router;
