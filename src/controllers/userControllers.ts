import { Request, Response } from 'express';
import { getUserByIdService, listUsersService, createUserService, updateUserService, deleteUserService, findExistingUserByEmail, validateUserData } from '../services/userService';
import { UserInput } from '../interfaces/userInput';
import { ValidationMode } from '../utils/enums';

/**
 * Controller to list all users
 * @param req Request
 * @param res Response
 * @returns A JSON response with the list of users
 * If an error occurs, it returns a 500 Internal Server Error response.
 */
export const listUsersController = async (req: Request, res: Response) => {
    try {
        const users = await listUsersService();
        if (users.length === 0) {
            return res.status(204).json({ message: 'No content' });
        }

        return res.status(200).json(users);
    } catch (error) {
        console.error('Error listing users:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * To get a user by id
 * @param req Request
 * @param res Response
 * @returns The user would be returned if it exists, otherwise a 404 response would be returned.
 */
export const getUserByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await getUserByIdService(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error getting user by id:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Create a new user.
 * @param req Request
 * @param res Response
 * @returns The created user, otherwise a 500 response would be returned.
 */
export const createUserController = async (req: Request, res: Response) => {
    try {
        const userData: UserInput = req.body;

        if (!validateUserData(userData, ValidationMode.CREATE)) {
            return res.status(400).json({ error: 'Missing required fields or Password must be at least 6 characters' });
        }

        const existingUser = await findExistingUserByEmail(userData.username, userData.email);
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        const newUser = await createUserService(userData);
        if (!newUser) {
            return res.status(500).json({ error: 'Failed to create user' });
        }

        return res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Update a user by id
 * @param req Request
 * @param res Response
 * @returns The updated user, if the user does not exist, a 404 response would be returned.
 * If an error occurs, a 500 response would be returned.
 */
export const updateUserByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userData: UserInput = req.body;

        if (!validateUserData(userData, ValidationMode.UPDATE)) {
            return res.status(400).json({ error: 'No fields provided for update' });
        }

        const user = await getUserByIdService(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userUpdate = await updateUserService(id, userData);
        return res.status(200).json(userUpdate);
    } catch (error) {
        console.error('Error updating user by id:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Delete a user by id
 * @param req Request
 * @param res Response
 * @returns A message indicating that the user was deleted,
 *  if the user does not exist, a 404 response would be returned.
 * If an error occurs, a 500 response would be returned.
 */
export const deleteUserByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await getUserByIdService(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await deleteUserService(id);
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user by id:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
