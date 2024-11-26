import clientPromise from ".";

let client;

export function init() {
  if (client) return;
  try {
    client = clientPromise;
  } catch (error) {
    throw new Error("Failed to establish connection to MQTT");
  }
}

(() => {
  init();
})();

export function getMQTTClient() {
  try {
    if (!client) init();
    return client;
  } catch (error) {
    throw new Error("Failed at ControlTest");
  }
}

export function MQQTpush(topic, message) {
  try {
    if (!client) init();
    return client.publish(topic, message);
  } catch (error) {
    throw new Error("Failed at ControlTest");
  }
}
