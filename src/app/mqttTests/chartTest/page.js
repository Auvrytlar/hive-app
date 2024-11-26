"use client";

import { useEffect, useState } from "react";
import { getMQTTClient } from "@lib/mqtt/controlTest";
import styles from "../../page.module.css";
// import useMqtt from "@lib/hooks/useMQTT";
import { useMqtt } from "@lib/context/MqttContext";
import { PrintObject } from "@components/temp/printObject";
import MqttChart from "@components/chart/MqttChart";

export default function Home() {
  const { mqttClient, mqttData, mqttStatus, mqttError, subscribeToTopic } = useMqtt();
  const [device, setDevice] = useState("553932323534160B12");
  const [module, setModule] = useState("0b9ea4220ec0");

  // const [data, setData] = useState([]);
  // useEffect(() => {
  //   // Ensure mqttData is valid
  //   if (mqttData.message) {
  //     setData((prevData) => [...prevData, JSON.parse(mqttData.message)]);
  //   }
  // }, [mqttData]);

  function SubscribeTopicButton() {
    function SubscribeTopic() {
      var topic = `hive/slaves/${device}/sensors/Temperature/${module}/telemetry`;
      console.log("Subscribed to", topic);
      subscribeToTopic([topic]);
    }
    return <button onClick={SubscribeTopic}>Subscribe</button>;
  }

  function UnsubscribeTopicButton() {
    function UnsubscribeTopic() {
      var topic = `hive/slaves/${device}/sensors/Temperature/${module}/telemetry`;
      console.log("Unsubscribed to", topic);
      mqttClient.unsubscribe([topic]);
    }
    return <button onClick={UnsubscribeTopic}>Unsubscribe</button>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Push Control on Click!</h1>
        <div>
          <button onClick={() => mqttClient.reconnect()}>Connect</button>
          <button onClick={() => mqttClient.end()}>Disconnect</button>
          Status: {mqttStatus}
        </div>
        <div>
          <table>
            <thead>
              <tr>
                <th>Device</th>
                <th>Module</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input name="device" defaultValue="553932323534160B12" onChange={(e) => setDevice(e.target.value)} />
                </td>
                <td>
                  <input name="module" defaultValue="0b9ea4220ec0" onChange={(e) => setModule(e.target.value)} />
                </td>
              </tr>
            </tbody>
          </table>
          <SubscribeTopicButton />
          <UnsubscribeTopicButton />
        </div>
        {mqttData?.topic && (
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column" }}>
            <h3>Latest Data:</h3>
            <p className="m-0">
              Topic: <span className="codeBlock">{mqttData?.topic ?? "N/A"}</span>
            </p>
            <p className="m-0">Message:</p>
            <PrintObject obj={mqttData.message && JSON.parse(mqttData.message)} />
            {/* <PrintObject obj={data} /> */}
            <MqttChart message={mqttData.message} />
          </div>
        )}
        {mqttError && (
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column" }}>
            <h3>🌈 Latest Error:</h3>
            <PrintObject obj={mqttError} />
          </div>
        )}
      </header>
    </div>
  );
}
