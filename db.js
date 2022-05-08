import {MongoClient} from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URL);
let db;

try{
    await mongoClient.connect()
    db = mongoClient.db(process.env.DATABASE);
} catch(error) {
    console.log("Cannot connect to Mongodb", error);
};
export default db;