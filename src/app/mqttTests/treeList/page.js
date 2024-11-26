"use client";

import { useEffect, useState } from "react";
import { getMQTTClient } from "@lib/mqtt/controlTest";
// import useMqtt from "@lib/hooks/useMQTT";
import { useMqtt } from "@lib/context/MqttContext";
import { PrintObject } from "@components/temp/printObject";
import Link from "next/link";
import React from "react";
import { NestedTopicTree } from "@lib/components/NestedTopicTree";

/*
 * The goal is to move catched mqttData directly to its component without having to do expensive operations.
 *
 * - We need to create the list in html. The list needs to update on new topics.
 * -
 */

/**
 * This code fails if you mix shorter topics with longer.
 * For example "Temperature/cdc9bfebb74c" & "Temperature/cdc9bfebb74c/telemetery".
 * In this case cdc9bfebb74c is the last index and its value becomes a string.
 * telemetery can therefore not be set as its parent does not expect an object.
 *
 * To fix this how about making this a tree of components?
 * This way the tree doesn't need additional entries for messages and can purely focus on topics.
 * Although this will prevent printObject from working.
 */
function mergePath(prevObj, mqttData) {
  const parts = mqttData.topic.split("/");
  let current = prevObj;

  parts.forEach((part, index) => {
    // If current[part] doesn't exist, create it
    if (!current[part]) {
      current[part] = {};
    }

    // Navigate deeper into the object for all parts except the last one
    if (index < parts.length - 1) {
      current = current[part];
    } else {
      // Only set the 'i' property on the last part without overwriting the whole object
      current[part].$__d = JSON.parse(mqttData.message);
    }
  });

  return prevObj;
}

/**
 * Basically, make a tree, render it as components. Each component will have a way to be linked to a topic.
 * When the topic updates, find the correct component and update it.
 *
 * componentList[mqttData.topic](mqttData.message)
 *
 *
 * 1.
 * - Make a tree simple, dont add messages yet.
 * - Add messages.
 *  a. find the items in the tree trough ...
 */

export default function Home() {
  const { mqttClient, mqttData, mqttStatus, mqttError, subscribeToTopic } = useMqtt();
  useEffect(() => {
    // if (mqttStatus == "Connected") subscribeToTopic(["hive/slaves/+/sensors/+/+"]);
    // if (mqttStatus == "Connected") subscribeToTopic(["hive/slaves/+/sensors/+/#"]);
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
      // console.log(listedData);
    }
  }, [mqttData]);

  // Splits topics and stores them as nested objects
  const [topicTree, setTopicTree] = useState({});
  const [seenTopics, setSeenTopics] = useState(new Set());
  // useEffect(() => {
  //   if (mqttData.message && !seenTopics.has(mqttData.topic)) {
  //     setSeenTopics((prevSeenTopics) => new Set(prevSeenTopics.add(mqttData.topic)));
  //     setTreeList((prevResult) => mergePath({ ...prevResult }, mqttData));
  //   }
  // }, [mqttData, seenTopics]);
  useEffect(() => {
    if (mqttData.message) {
      setTopicTree((prevResult) => mergePath({ ...prevResult }, mqttData));
      // console.log(topicTree);
    }
  }, [mqttData]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Push Control on Click!</h1>
        <div>
          <button onClick={() => mqttClient.reconnect()}>Connect</button>
          <button onClick={() => mqttClient.end()}>Disconnect</button>
          Status: {mqttStatus}
        </div>
      </header>
      {mqttData?.topic && (
        <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column" }}>
          <h3>Latest Data:</h3>
          <p className="m-0">
            Topic: <span className="codeBlock">{mqttData?.topic ?? "N/A"}</span>
          </p>
          <p className="m-0">Message:</p>
          <PrintObject obj={mqttData.message && JSON.parse(mqttData.message)} />
          {listedData && (
            <details open>
              <summary>listedData</summary>
              <NestedTopicTree mqttData={listedData} />
              <PrintObject obj={listedData} />
              {/* <NestedDetails data={listedData} /> */}
            </details>
          )}
          {topicTree && (
            <details open>
              <summary>topicTree</summary>
              <PrintObject obj={topicTree} />
              {/* <RenderTopics topics={topicTree} /> */}
            </details>
          )}
          {/* <TreeView data={mqttData.topic} /> */}
          {/* <Node data={topicTree} path="root" label="root" className={"codeBlock"} /> */}
        </div>
      )}
      {mqttError && (
        <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column" }}>
          <h3>🌈 Latest Error:</h3>
          <PrintObject obj={mqttError} />
        </div>
      )}
    </div>
  );
}

const TempComp = ({ data }) => {
  // return <PrintObject obj={{ topic: data.topic, message: JSON.parse(data.message) }} />;
  return <PrintObject obj={data} />;
  // return JSON.stringify({ topic: data.topic, message: JSON.parse(data.message) });
};

const NestedDetails = ({ data, path = "" }) => {
  const buildTree = (obj) => {
    const tree = {};

    for (const [key, value] of Object.entries(obj)) {
      const parts = key.split("/");
      let currentLevel = tree;

      parts.forEach((part, index) => {
        if (!currentLevel[part]) {
          currentLevel[part] = index === parts.length - 1 ? value : {};
        }
        currentLevel = currentLevel[part];
      });
    }

    return tree;
  };

  const renderTree = (obj) => {
    return Object.entries(obj).map(([key, value]) => {
      if (typeof value === "object" && !Array.isArray(value) && value !== null) {
        return (
          <details key={key} open>
            <summary>{key}</summary>
            <div>{renderTree(value)}</div>
          </details>
        );
      } else {
        return (
          <div key={key}>
            <strong>{key}:</strong> <pre>{JSON.stringify(value, null, 2)}</pre>
          </div>
        );
      }
    });
  };

  const tree = buildTree(data);
  return <div>{renderTree(tree)}</div>;
};

// Component to recursively display topic hierarchy
const TopicNode = ({ name, children_, style }) => {
  return (
    <details open style={style}>
      <summary>{name}</summary>
      {children_ &&
        Object.keys(children_).map((childName) => {
          return <TopicNode key={childName} style={{ marginLeft: "20px" }} name={childName} children_={children_[childName]} />;
        })}
    </details>
  );
};

const RenderTopics = ({ topics }) =>
  Object.keys(topics).map((topic) => (
    <TopicNode key={topic} name={topic} children_={topics[topic]}>
      {/* {topics[topic].message && JSON.parse(topics[topic].message)} */}
      Test
    </TopicNode>
  ));

/*
const NodeDetails = ({ path, data }) => {
  const renderDetails = (obj, parentPath) => {
    console.log(obj);
    return Object.entries(obj).map(([key, value]) => {
      const currentPath = `${parentPath}/${key}`;
      if (typeof value === "object" && !Array.isArray(value) && !(value.$$typeof === Symbol.for("react.element"))) {
        // If value is another object.

        // if (value.$$typeof === Symbol.for("react.element")) return value;
        return <Node key={currentPath} path={currentPath} label={key} data={value} />;
      } else {
        // If value is not an object. i.e. its a string.

        return (
          <div key={currentPath} style={{ marginLeft: "30px" }}>
            <span>
              {value.$$typeof === Symbol.for("react.element") ? (
                <>
                  <button onClick={() => console.log(`Button clicked for path: ${currentPath}`)}>{key}</button> {value}
                </>
              ) : (
                <>
                  <button onClick={() => console.log(`Button clicked for path: ${currentPath}`)}>{key}</button> {JSON.stringify(value)}
                </>
              )}
            </span>
          </div>
        );
      }
    });
  };

  return renderDetails(data, path);
};

const Node = ({ path, label, data }) => {
  return (
    <details style={{ marginLeft: "20px" }} open>
      <summary>
        <button onClick={() => console.log(`Button clicked for path: ${path}`)}>{label}</button>
      </summary>
      <NodeDetails path={path} data={data} />
    </details>
  );
};
*/
