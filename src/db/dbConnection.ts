import { sequelize } from '../db/dbConfig';
import { DBConfig } from '../utils/enums';

/**
 * Checks the connection to the database.
 * @returns Promise that resolves if the connection to the database is successful, or rejects if it fails.
 */
export const checkDatabaseConnection = async (): Promise<void> => {
    let retries = 0;

    while (retries < DBConfig.MAX_RETRIES) {
        try {
            console.log(`Attempted connection to database number ${retries + 1}...`);
            await sequelize.authenticate();
            console.log("Successful connection to the database.");
            await sequelize.sync();
            console.log("All models were synchronized successfully.");
            return;
        } catch (error) {
            console.error("Error when connecting to the database:", error);
            retries++;
            await new Promise(resolve => setTimeout(resolve, DBConfig.RETRY_INTERVAL));
        }
    }

    throw new Error(`Could not connect to database after ${DBConfig.MAX_RETRIES} attempts.`);
};
