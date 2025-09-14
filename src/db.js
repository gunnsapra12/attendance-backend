import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let dbInstance = null;

export default async function connectToDatabase(dbName) {
  if (dbInstance) return dbInstance;

  const client = new MongoClient(process.env.MONGO_URL);
  await client.connect();
  dbInstance = client.db(dbName);

  console.log("✅ Database connected successfully");
  return dbInstance;
}
