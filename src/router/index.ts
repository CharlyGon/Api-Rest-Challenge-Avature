import express from 'express';
import jobsRoutes from './jobRoutes';
import usersRoutes from './userRoutes';

const router = express.Router();

router.use('/jobs',jobsRoutes)
router.use('/users',usersRoutes)

export default router;
