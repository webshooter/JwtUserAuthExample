import { MongoClient } from "mongodb";

// eslint-disable-next-line import/named
import { mongo } from "../src/config";

const { uri, dbName, options } = mongo;
const client = new MongoClient(uri, options);

// eslint-disable-next-line import/no-mutable-exports
let connection;

// eslint-disable-next-line import/no-mutable-exports
let db;

const makeDb = async () => {
  if (!client.isConnected()) {
    await client.connect();
  }
  return client.db(dbName);
};

const closeDb = async () => {
  if (connection) {
    await connection.close();
  }
};

const clearDb = async ({ collectionName }) => {
  if (db) {
    await db.collection(collectionName).deleteMany({});
  }
  return true;
};

export default makeDb;
export { closeDb, clearDb, connection, db };
