import mqtt from "mqtt"; //const mqtt = require("mqtt");

/**
 * @typedef {{
 * 	ssl: boolean,
 * 	setMqttStatus: (status: string) => void,
 *  setMqttError: (error: string) => void,
 *  uniqueId: string,
 * 	onMessage: (topic: string, message: any) => void,
 * }} CreateMqttClientOptions
 */

/**
 * @param {CreateMqttClientOptions} options
 *
 * @returns {mqtt.MqttClient}
 */
function createMqttClient({ ssl = false, setMqttStatus, setMqttError, uniqueId, onMessage }) {
  const host = "192.168.0.30"; // 127.0.0.1 | localhost
  const path = "/ws";
  const protocolVersion = 5;
  let port = 9001;
  let protocol = "ws";

  if (ssl) {
    port = process.env.MQTT_PORT_SSL;
    protocol = "wss";
  }

  const client = mqtt
    .connect(`${protocol}://${host}${path}`, {
      port,
      protocolVersion,
      protocol,
      clientId: uniqueId,
      reconnectPeriod: 5000,
      queueQoSZero: true,
      resubscribe: true,
      clean: true, // subscriptions are restored upon reconnection if clean: true
      keepalive: 30,
      properties:
        protocolVersion === 5
          ? {
              sessionExpiryInterval: 600,
            }
          : undefined,
    })
    .on("connect", () => {
      setMqttStatus("Connected");
    })
    .on("error", (error) => {
      setMqttStatus("Error");
      setMqttError(`Name: ${error?.name}\nMessage: ${error?.message}\nCode: ${error?.code}`);
    })
    .on("disconnect", (packet) => {
      setMqttStatus("Disconnected");
    })
    .on("offline", () => {
      setMqttStatus("Offline");
    })
    .on("reconnect", () => {
      setMqttStatus("Reconnecting");
    })
    .on("close", () => {
      setMqttStatus("Disconnected");
    })
    .on("message", (topic, message, packet) => {
      onMessage(topic, message);
    });

  return client;
}

export { createMqttClient };
