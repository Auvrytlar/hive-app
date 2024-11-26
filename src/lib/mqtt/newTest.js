import clientPromise from ".";

let client;

function init() {
  if (client) return;
  try {
    client = clientPromise;
  } catch (error) {
    throw new Error("Failed to establish connection to MQTT");
  }
}