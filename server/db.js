import { MongoClient } from "mongodb";

let clientPromise;
let indexesPromise;

export async function getDatabase() {
  const uri = process.env.MONGODB_URI;
  const databaseName = process.env.MONGODB_DB;
  if (!uri || !databaseName) {
    throw new Error("MongoDB is not configured.");
  }

  if (!clientPromise) {
    const client = new MongoClient(uri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000
    });
    clientPromise = client.connect().catch(error => {
      clientPromise = undefined;
      throw error;
    });
  }

  const client = await clientPromise;
  const database = client.db(databaseName);
  if (!indexesPromise) {
    indexesPromise = Promise.all([
      database.collection("reports").createIndex({ id: 1 }, { unique: true }),
      database.collection("reports").createIndex(
        { labNoKey: 1 },
        { unique: true, partialFilterExpression: { labNoKey: { $exists: true } } }
      )
    ]).catch(error => {
      indexesPromise = undefined;
      throw error;
    });
  }
  await indexesPromise;
  return database;
}
