"use client";
import { getMQTTClient } from "@lib/mqtt/controlTest";
import { useEffect, useState } from "react";

export function MqttInteractions({ node, subPath }) {
  const [client, setClient] = useState();
  const [msg, setMsg] = useState();

  useEffect(() => {
    setClient(getMQTTClient()); // Not needed...
  }, []);

  useEffect(() => {
    if (client) {
      console.log(client);
      client.subscribe(`hive/masters/${node}/${subPath}`);

      client.on("message", handleMessage);
    }

    return () => {
      if (client) {
        console.log("Removing");
        client.unsubscribe(`hive/masters/${node}/${subPath}`);
        client.removeListener("message", handleMessage);
        // client.end();
      }
    };
  }, [client]);

  const handleMessage = (topic, message) => {
    if (topic != `hive/masters/${node}/${subPath}`) return;
    var note = message.toString();
    setMsg(note);
    console.log("got:", note);
  };

  function handleClick() {
    console.log("Clicked!");
    client.publish(`hive/masters/${node}/${subPath}`, JSON.stringify({ data: "Debug", t: new Date() }));
  }

  return (
    <>
      <div className="d-flex flex-row justify-content-between">
        {`hive/masters/${node}/${subPath}`}
        <button onClick={handleClick}>Do something...</button>
      </div>
      {msg? <p className="code">{msg}</p> : ""}
    </>
  );
}
