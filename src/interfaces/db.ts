import { Op } from 'sequelize';

export interface DbConfig {
    [key: string]: {
        [x: string]: any;
        dialect: string;
        storage: string;
    };
}

type WhereValue = string | number | boolean | string[] | number[] | { [Op.like]?: string };

export interface WhereClause {
    [key: string]: WhereValue | WhereValue[];
}
