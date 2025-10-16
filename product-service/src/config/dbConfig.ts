import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.POSTGRES_DB || "convertcart",
  process.env.POSTGRES_USER || "postgres",
  process.env.POSTGRES_PASSWORD || "postgres",
  {
    host: process.env.DATABASE_HOST || "postgres",
    port: Number(process.env.DATABASE_PORT) || 5432,
    dialect: "postgres",
    logging: false
  }
);

export default sequelize;