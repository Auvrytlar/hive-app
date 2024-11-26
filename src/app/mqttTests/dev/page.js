"use client";

import { useState } from "react";
import { getMQTTClient } from "@lib/mqtt/controlTest";
// import useMqtt from "@lib/hooks/useMQTT";
import { useMqtt } from "@lib/context/MqttContext";
import { PrintObject } from "@components/temp/printObject";

export default function Home() {
  const { mqttClient, mqttData, mqttStatus, mqttError, subscribeToTopic } = useMqtt();
  const [topic, setTopic] = useState("hive/debug");

  const handleMessage = (topic, message) => {
    var note = message.toString();
    setMsg(note);
    console.log("got:", note);
  };

  function MyButton({ value }) {
    function handleClick() {
      console.log("Clicked!");
      mqttClient.publish(topic, JSON.stringify({ data: new Date() }));
    }
    return <button onClick={handleClick}>{value}</button>;
  }

  function SubscribeTopicButton() {
    function SubscribeTopic() {
      console.log("Subscribed to", topic);
      subscribeToTopic([topic]);
    }
    return <button onClick={SubscribeTopic}>Subscribe</button>;
  }

  function UnsubscribeTopicButton() {
    function UnsubscribeTopic() {
      console.log("Unsubscribed to", topic);
      mqttClient.unsubscribe([topic]);
    }
    return <button onClick={UnsubscribeTopic}>Unsubscribe</button>;
  }

  return (
    <div className="App">
      {/* <header className="App-header">
        <h1>Push Control on Click!</h1>
        <div>
          <button onClick={() => mqttClient.reconnect()}>Connect</button>
          <button onClick={() => mqttClient.end()}>Disconnect</button>
          Status: {mqttStatus}
        </div>
        <div>
          <input name="topic" defaultValue="hive/debug" onChange={(e) => setTopic(e.target.value)} />
          <SubscribeTopicButton />
          <UnsubscribeTopicButton />
        </div>
        <MyButton value={"Push!"} />
        {mqttData?.topic && (
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column" }}>
            <h3>Latest Data:</h3>
            <p className="m-0">
              Topic: <span className="codeBlock">{mqttData?.topic ?? "N/A"}</span>
            </p>
            <p className="m-0">Message:</p>
            <PrintObject obj={mqttData.message && JSON.parse(mqttData.message)} />
          </div>
        )}
        {mqttError && (
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column" }}>
            <h3>🌈 Latest Error:</h3>
            <PrintObject obj={mqttError} />
          </div>
        )}
      </header> */}
    </div>
  );
}
