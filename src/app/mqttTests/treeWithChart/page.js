"use client";

import { useEffect, useState } from "react";
import { getMQTTClient } from "@lib/mqtt/controlTest";
import styles from "../../page.module.css";
// import useMqtt from "@lib/hooks/useMQTT";
import { useMqtt } from "@lib/context/MqttContext";
import { PrintObject } from "@components/temp/printObject";
import { NestedTopicTree } from "@lib/components/NestedTopicTree";
import MqttChart from "@lib/components/chart/MqttChart";

export default function Home() {
  const { mqttClient, mqttData, mqttStatus, mqttError, subscribeToTopic } = useMqtt();
  const [current, setCurrent] = useState();
  useEffect(() => {
    if (mqttStatus == "Connected") subscribeToTopic(["#"]);
  }, [mqttStatus]);

  // Stores data trough upserting topics. i.e. data is unique trough topics.
  const [listedData, setListedData] = useState([]);
  useEffect(() => {
    if (mqttData.topic) {
      setListedData((prevMessages) => ({
        ...prevMessages,
        [mqttData.topic]: JSON.parse(mqttData.message),
      }));
    }
  }, [mqttData]);

  const handleChange = (topic) => {
    setCurrent(topic);
  };

  return (
    <div>
      <header>
        <h1>Tree with Live chart</h1>
        <button onClick={() => mqttClient.reconnect()}>Connect</button>
        <button onClick={() => mqttClient.end()}>Disconnect</button>
        <p>Status: {mqttStatus}</p>
        {mqttError && (
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column" }}>
            <h3>🌈 Latest Error:</h3>
            <PrintObject obj={mqttError} />
          </div>
        )}
        {current && current}
      </header>
      <div className="d-flex">
        <NestedTopicTree mqttData={listedData} handleSelect={handleChange} />
        {current && listedData[current] ? <MqttChart message={listedData[current]} /> : "No data selected"}
      </div>
    </div>
  );
}
