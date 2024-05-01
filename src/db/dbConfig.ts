import { Sequelize, Options, Dialect } from "sequelize";
import * as dbConfigJson from "../../config/config.json";
import { DbConfig } from "../interfaces/db";

const config: DbConfig = dbConfigJson;
const environment = process.env.NODE_ENV || "development";
const dbConfig = config[environment];

const sequelizeOptions: Options = {
    dialect: dbConfig.dialect as Dialect,
    storage: dbConfig.storage,
};

export const sequelize = new Sequelize(sequelizeOptions);
