import { MongoClient } from "mongodb";

// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from "mongodb-memory-server";

// eslint-disable-next-line import/no-mutable-exports
let connection;

// eslint-disable-next-line import/no-mutable-exports
let db;

// eslint-disable-next-line import/no-mutable-exports
let dbName;


const makeDb = async () => {
  if (!connection) {
    const mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    dbName = await mongoServer.getDbName();
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    connection = await MongoClient.connect(mongoUri, connectionOptions);
  }

  if (!db) {
    db = await connection.db(dbName);
  }

  return db;
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
