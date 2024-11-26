// Rename to Utils->startMongodb

// import clientPromise from "./index";
import clientPromise from ".";
import { ObjectId } from "mongodb";
import { MongoClient } from "mongodb";

let client;
let db;
let cluster;
let readings;

let l = new MongoClient(process.env.MONGODB_URI, {});

async function init() {
  if (db) return;
  // try {

  client = await clientPromise;
  db = await client.db();

  cluster = await db.collection("nodes");
  readings = await db.collection("telemetry");
  // } catch (error) {
  //   throw new Error("Failed to establish connection to DB");
  // }
}

(async () => {
  await init();
})();

export async function getCluster() {
  if (!cluster) await init();
  const result = await cluster.find({}).toArray();
  // .limit(20)
  // .map((user) => ({ ...user, _id: user._id.toString() }))
  // .toArray();
  return result;
}

export async function getNode(nodeID) {
  if (!cluster) await init();
  const result = await cluster.findOne({ _id: new ObjectId(nodeID) });
  return result;
}

export async function getRecord(record) {
  if (!readings) await init();

  const result = await readings.find({ rParent: new ObjectId(record) }).toArray();
  // console.log(result)
  return result;
}
