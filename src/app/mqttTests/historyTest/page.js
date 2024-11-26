"use client";

import { useEffect, useMemo, useState } from "react";
import { getMQTTClient } from "@lib/mqtt/controlTest";
import styles from "../../page.module.css";
// import useMqtt from "@lib/hooks/useMQTT";
import { useMqtt } from "@lib/context/MqttContext";
import { PrintObject } from "@components/temp/printObject";
import { NestedTopicTree } from "@lib/components/NestedTopicTree";
import MqttChart from "@lib/components/chart/MqttChart";

export default function Home() {
  const { mqttClient, mqttData, mqttStatus, mqttError, subscribeToTopic } = useMqtt();
  useEffect(() => {
    if (mqttStatus == "Connected") subscribeToTopic(["#"]);
  }, [mqttStatus]);

  // Stores data trough upserting topics. i.e. data is unique trough topics.
  const [listedData, setListedData] = useState({});
  const makeTree = (topic, message) => {
    const topicParts = topic.split("/");
    let currentPath = "";
    let parentNode = null;
    let updatedData = { ...listedData };
    const parsedMessage = JSON.parse(message);

    topicParts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      // Initialize the current node if it doesn't exist
      if (!updatedData[currentPath]) {
        updatedData[currentPath] = {
          name: part,
          message: {},
          messageHistory: {
            capacity: 100,
            items: [],
          },
          edgeArray: [],
          edges: {},
          sourceEdge: {},
        };
      }

      // Add message to the last part of the topic
      if (index === topicParts.length - 1) {
        updatedData[currentPath].message = parsedMessage;
        updatedData[currentPath].messageHistory.items.push(parsedMessage);

        // Trim message history to maintain capacity limit
        if (updatedData[currentPath].messageHistory.items.length > updatedData[currentPath].messageHistory.capacity) {
          updatedData[currentPath].messageHistory.items.shift();
        }
      }

      // Create an edge between the parent node and the current node
      if (parentNode) {
        const thisNode = updatedData[currentPath];
        const edgeExists = parentNode.edgeArray.some((edge) => edge.target === thisNode);

        if (!edgeExists) {
          const edge = {
            name: part,
            source: parentNode,
            target: thisNode,
          };
          parentNode.edgeArray.push(edge);
          parentNode.edges[part] = edge;
        }

        // // Set sourceEdge for current node
        // updatedData[currentPath].sourceEdge = {
        //   name: part,
        //   source: targetNode,
        //   target: parentNode,
        // };
      }

      // Update parentNode to the current node
      parentNode = updatedData[currentPath];
    });

    setListedData(updatedData);
  };

  useEffect(() => {
    if (mqttData.topic) {
      makeTree(mqttData.topic, mqttData.message);
      // console.log(listedData);
    }
  }, [mqttData]);

  let o = {
    __children: {},
    __data: {},
    __topic: "hive/slaves/Test",
    __history: [
      { value: 23, timeStamp: "1718322707" },
      { value: 22, timeStamp: "1718322997" },
    ],
  };

  let l = {
    "hive/slaves/Test": {
      message: {},
      history: [
        { value: 23, timeStamp: "1718322707" },
        { value: 22, timeStamp: "1718322997" },
      ],
    },
  };
  l["hive/slaves/Test"].history;

  /**
   * Step 1. MakeTreeHierarchy() <- Only on new topic
   *
   * - Components can get their data as long as they know their topic!
   *   list[topic].message
   */

  /**
   * Step ?. RenderHierarchy
   */

  // let node = {
  //   topic: "hive/slaves",
  //   name: "slaves",
  //   message: { received: Date(), value: "" },
  //   messageHistory: { items: message },
  //   source: {},
  //   children: [
  //     {
  //       topic: "slaves",
  //       source: {},
  //       children: [{}],
  //     },
  //   ],
  // };

  let data = [
    {
      name: "Root 1",
      subnodes: [
        {
          name: "Child 1-1",
          subnodes: [{ name: "Child 1-1-1" }, { name: "Child 1-1-2" }],
        },
        { name: "Child 1-2" },
      ],
    },
    {
      name: "Root 2",
      subnodes: [{ name: "Child 2-1" }, { name: "Child 2-2" }],
    },
  ];

  // let nodes = {
  // 1: {
  //   name: "1",
  //   data: { p: "Test" },
  //   edgeArray: [],
  //   edges: {},
  // },
  //   "1-1": {
  //     name: "1-1",
  //     data: { p: "Test2" },
  //     edgeArray: [],
  //     edges: {},
  //   },
  //   "1-1-1": {
  //     name: "1-1-1",
  //     data: { p: "Test2" },
  //     edgeArray: [],
  //     edges: {},
  //   },
  // };

  // let edges = [
  //   { name: "Edge 1-1", source: nodes["1"], target: nodes["1-1"] },
  //   { name: "Edge 1-1-1", source: nodes["1-1"], target: nodes["1-1-1"] },
  // ];
  // // Edges are only directed towards children, never upwards to the parent.

  // nodes["1"].edgeArray.push(edges[0]);
  // nodes["1"].edges["1-1"] = edges[0];
  // nodes["1-1"].edgeArray.push(edges[1]);
  // nodes["1-1"].edges["1-1-1"] = edges[1];

  // nodes["1-1"].data = { p: "Test3" };

  // console.log(nodes);

  // Good. Now lets make nodes an object!

  return (
    <div>
      <header>
        <h1>HistoryTest</h1>
        <button onClick={() => mqttClient.reconnect()}>Connect</button>
        <button onClick={() => mqttClient.end()}>Disconnect</button>
        <p>Status: {mqttStatus}</p>
        {mqttError && (
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column" }}>
            <h3>🌈 Latest Error:</h3>
            <PrintObject obj={mqttError} />
          </div>
        )}
        {/* {current && current} */}
      </header>
      <div className="d-flex">{listedData && listedData.hive && <Tree tree={listedData["hive"]} />}</div>
    </div>
  );
}

const Tree = ({ tree }) => {
  console.log("Tree");
  if (!tree) {
    return null;
  }
  return (
    <div>
      <TreeNode treeNode={tree} />
    </div>
  );
};

const TreeNode = ({ treeNode }) => {
  console.log("TreeNode");
  if (treeNode == undefined) {
    return;
  }
  const [expanded, setExpanded] = useState(true);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  function renderNodes() {
    return <TreeNodeSubnodes treeNode={treeNode} />;
  }

  return (
    <div>
      <div onClick={handleToggle}>
        {treeNode.edgeArray && treeNode.edgeArray.length > 0 && (expanded ? " ▼" : " ▶")}
        {treeNode.name || "Root"}
      </div>
      {expanded && renderNodes()}
      {/* {expanded && <TreeNodeSubnodes subnodes={node} />} */}
    </div>
  );
};

function useStagedRendering(treeNode) {
  const [alreadyAdded, setAlreadyAdded] = useState(10);
  const edges = treeNode.edgeArray;

  useEffect(() => {
    let renderMoreAnimationFrame;

    if (alreadyAdded < edges.length) {
      renderMoreAnimationFrame = window.requestIdleCallback(
        () => {
          setAlreadyAdded(Math.max(25, alreadyAdded * 1.5));
        },
        { timeout: 500 }
      );
    }

    return function cleanup() {
      window.cancelIdleCallback(renderMoreAnimationFrame);
    };
  }, [alreadyAdded, edges.length]);

  return alreadyAdded;
}
const TreeNodeSubnodes = ({ treeNode }) => {
  console.log("TreeNodeSubnodes");
  const alreadyAdded = useStagedRendering(treeNode);
  // Sort subnodes here

  return useMemo(() => {
    // Sort
    const edges = [...treeNode.edgeArray];
    edges.sort((a, b) => a.name.localeCompare(b.name));
    const nodes = edges.map((edge) => edge.target).slice(0, alreadyAdded); // ???

    const listItems = nodes.map((node, index) => {
      console.log("TreeNodeSubnodes added new");
      return (
        <div style={{ paddingLeft: "20px" }}>
          <TreeNode treeNode={node} />
        </div>
      );
    });
    return listItems;
  }, [alreadyAdded]);
};
