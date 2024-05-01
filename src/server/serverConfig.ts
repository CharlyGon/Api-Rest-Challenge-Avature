import { Express } from 'express';
import http from 'http';
import { checkDatabaseConnection } from '../db/dbConnection';
import * as dbConfigJson from "../../config/config.json";
import { DbConfig } from "../interfaces/db";

/**
 *Initializes the Express server and puts it to listen on the specified port.
 * @param app Express application
 * @returns Server instance or null if an error occurred
 */
export const startServer = async (app: Express): Promise<http.Server | null> => {
    const config: DbConfig = dbConfigJson;
    const environment = process.env.NODE_ENV || 'development';
    const port = config[environment].port;

    try {
        await checkDatabaseConnection();

        const server = app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

        return server;
    } catch (error) {
        console.error('Error when connecting to the database:', error);
        return null;
    }
};
