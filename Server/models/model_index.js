import dotenv from "dotenv";
import { readdirSync } from "fs";
import { basename, dirname } from "path";
import { Sequelize, DataTypes } from "sequelize";
import { fileURLToPath } from "url";

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PWD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false,
        define: {
            timestamps: false
        }
    }
)

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const db = {};


const files = readdirSync(__dirname).filter(
    (file) =>
        file.indexOf(".") !== 0 &&
        file !== basename(__filename) &&
        file.slice(-3) === ".js"
);

for await (const file of files) {
    // use path here to access your models from models directory then await for it @
    const model = await import(`./${file}`);
    if (model.default) {
        const namedModel = await model.default(sequelize, DataTypes);
        db[namedModel.name] = namedModel;
    }
}

Object.keys(db).forEach((modelName) => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;