import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/dbConfig';

export interface JobAttributes {
  id?: number;
  title: string;
  description: string;
  company: string;
  location: string;
  publishDate: Date;
  expirationDate?: Date;
  status: string;
}

class Job extends Model<JobAttributes> implements JobAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public company!: string;
  public location!: string;
  public publishDate!: Date;
  public expirationDate?: Date;
  public status!: string;
}

Job.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publishDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Job',
    tableName: 'jobs',
    timestamps: false,
  }
);

export default Job;
