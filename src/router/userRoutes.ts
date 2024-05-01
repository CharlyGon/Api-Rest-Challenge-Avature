import express from 'express';
import { createUserController, deleteUserByIdController, getUserByIdController, listUsersController, updateUserByIdController } from '../controllers/userControllers';

const router = express.Router();

router.get('/', listUsersController);
router.get('/:id', getUserByIdController);
router.post('/', createUserController);
router.put('/:id', updateUserByIdController);
router.delete('/:id', deleteUserByIdController);

export default router;
