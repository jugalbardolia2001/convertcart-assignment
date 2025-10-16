import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
const sequelize = new Sequelize(process.env.POSTGRES_DB || "convertcart", process.env.POSTGRES_USER || "postgres", process.env.POSTGRES_PASSWORD || "ChangeMe007", {
    host: process.env.DATABASE_HOST || "localhost",
    dialect: "postgres",
    logging: false
});
export default sequelize;
