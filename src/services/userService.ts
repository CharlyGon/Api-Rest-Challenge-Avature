import { Op } from "sequelize";
import { UserInput } from "../interfaces/userInput";
import User from "../models/userModel";
import { ValidationMode } from "../utils/enums";

/**
 * List all users
 * @returns A list of users
 */
export const listUsersService = async (): Promise<User[]> => {
    try {
        const users = await User.findAll();
        return users;
    } catch (error) {
        console.error('Error listing users:', error);
        throw new Error('Internal server error');
    }
}

/**
 * Get a user by id
 * @param id User id
 * @returns The user with the specified id
 */
export const getUserByIdService = async (id: string): Promise<User | null> => {
    try {
        if (!id) {
            throw new Error('No id provided');
        }

        const user = await User.findByPk(id);
        if (!user) {
            console.error('User not found');
            return null;
        }

        return user;
    } catch (error) {
        console.error('Error getting user by id:', error);
        throw new Error('Internal server error');
    }
}

/**
 * Create a new user
 * @param userData User data
 * @returns The created user
 */
export const createUserService = async (userData: UserInput): Promise<User> => {
    try {
        if (!validateUserData(userData, ValidationMode.CREATE)) {
            throw new Error('Missing required fields or Password must be at least 6 characters');
        }

        const existingUser = await findExistingUserByEmail(userData.username, userData.email);
        if (existingUser) {
            throw new Error('Username or email already exists');
        }

        return await User.create(userData);
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Internal server error');
    }
}

/**
 * Update a user by id
 * @param id User id
 * @param userData User data to update
 * @returns The updated user
 */
export const updateUserService = async (id: string, userData: UserInput): Promise<User> => {
    try {
        if (!validateUserData(userData, ValidationMode.UPDATE)) {
            throw new Error('No fields provided for update');
        }

        const user = await getUserByIdService(id);
        if (!user) {
            throw new Error('User not found');
        }

        return await user.update(userData);
    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Internal server error');
    }
}

/**
 * Delete a user by id
 * @param id User id
 */
export const deleteUserService = async (id: string): Promise<boolean> => {
    try {
        const user = await getUserByIdService(id);
        if (!user) {
            console.error('User not found');
            return false;
        }

        await user.destroy();
        return true;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Internal server error');
    }
}

/**
 * Find a user by username or email
 * @param username The username to find
 * @param email The email to find
 * @returns The user with the specified username or email, if it exists, null otherwise
 */
export const findExistingUserByEmail = async (username: string, email: string): Promise<User | null> => {
    try {
        const user = await User.findOne({
            where: {
                [Op.or]: [{ username }, { email }]
            }
        });

        return user || null;
    } catch (error) {
        console.error('Error finding user by email:', error);
        throw new Error('Internal server error');
    }
}

/**
 * Validate user data for creation or update
 * @param userData The user data to validate
 * @param mode The mode of validation (CREATE or UPDATE)
 * @returns True if the user data is valid, false otherwise
 */
export const validateUserData = (userData: UserInput, mode: ValidationMode): boolean => {
    let requiredFields: (keyof UserInput)[];

    if (mode === ValidationMode.CREATE) {
        requiredFields = ['username', 'email', 'password'];
    } else {
        requiredFields = ['password', 'role', 'firstName', 'lastName'];
    }

    // Check for the presence of all required fields in CREATE mode
    // or at least one field in UPDATE mode
    const isValid = mode === ValidationMode.CREATE
        ? requiredFields.every(field => userData[field] !== undefined && userData[field] !== '')
        : requiredFields.some(field => userData[field] !== undefined && userData[field] !== '');

    if (!isValid) {
        console.error(`Validation failed for ${mode} mode: Required fields are missing or empty.`);
        return false;
    }

    if ('password' in userData && userData.password.length < 6) {
        console.error('Password must be at least 6 characters');
        return false;
    }

    return true;
}
