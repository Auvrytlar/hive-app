"use client";
import { getMQTTClient } from "@lib/mqtt/controlTest";
import { Switch } from "@components/Switch";
import { useEffect, useRef, useState } from "react";

export function MQTTObservations({ nodeID }) {
  const [client, setClient] = useState();
  const [msg, setMsg] = useState([]);

  // let node = "00:15:5d:ff:d3:0a";
  let node = nodeID.nHardwareUID;
  // console.log(node);

  useEffect(() => {
    setClient(getMQTTClient()); // Not needed?
  }, []);

  useEffect(() => {
    if (client) {
      client.on("message", handleMessage);

      // Initial Listeners
      toggleLogs();
      toggleStatus();
    }

    return () => {
      if (client) {
        console.log("Removing MQTT Client");
        // client.unsubscribe(`hive/masters/${node}/${subPath}`); // Not needed?
        client.removeListener("message", handleMessage);
        // client.end();
      }
    };
  }, [client]);

  const handleMessage = (topic, message) => {
    const fullPath = topic;
    const parts = fullPath.split("/");
    const lastPart = parts[parts.length - 1];

    setMsg((msg) => [
      ...msg,
      <p className="m-1" key={msg}>
        {lastPart}: {message.toString()}
      </p>,
    ]);
  };

  const toggleDebug = () => {};
  const [logs, setLogs] = useState(false);
  const toggleLogs = () => {
    if (client) {
      if (logs) client.unsubscribe(`hive/slaves/${node}/logs`);
      else client.subscribe(`hive/slaves/${node}/logs`);
      setLogs(!logs);
    }
  };
  const [status, setStatus] = useState(false);
  const toggleStatus = () => {
    if (client) {
      if (status) client.unsubscribe(`hive/slaves/${node}/status`);
      else client.subscribe(`hive/slaves/${node}/status`);
      setStatus(!status);
    }
  };

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between" style={{ style: 100 + "px" }}>
        <table className="table table-sm table-striped table-hover caption-top " style={{ width: 300 + "px", height: "fit-content" }}>
          <caption>Active Observations</caption>
          <thead className="table-dark">
            <tr>
              {/* <th scope="col">#</th> */}
              <th scope="col">Listen</th>
              <th scope="col">Topic</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Switch state={false} onChange={toggleDebug} />
              </td>
              <td>debug</td>
            </tr>
            <tr>
              <td>
                <Switch state={logs} onChange={toggleLogs} />
              </td>
              <td>logs</td>
            </tr>
            <tr>
              <td>
                <Switch state={status} onChange={toggleStatus} />
              </td>
              <td>status</td>
            </tr>
          </tbody>
        </table>
        {/* <CodeBlock code={msg} /> */}
      </div>
      <hr className="m-4" />
    </>
  );
}

function CodeBlock({ code }) {
  const scrollableContentRef = useRef(null);
  const [content, setContent] = useState([]);
  const [keepScroll, setKeepScroll] = useState(true);

  useEffect(() => {
    // If ref exists and ref is currently scrolled to bottom.
    if (
      scrollableContentRef.current &&
      scrollableContentRef.current.scrollTop == scrollableContentRef.current.scrollHeight &&
      keepScroll != true
    )
      setKeepScroll(true);
    else setKeepScroll(false);
    setContent(code);
  }, [code]);

  useEffect(() => {
    if (keepScroll && scrollableContentRef.current) scrollableContentRef.current.scrollTop = scrollableContentRef.current.scrollHeight;
  }, [content]);

  return (
    <pre
      className="card overflow-auto p-2 w-100"
      style={{ minidth: 300 + "px", height: 200 + "px", backgroundColor: "#f1f1f1" }}
      ref={scrollableContentRef}
    >
      <code>{content}</code>
    </pre>
  );
}
