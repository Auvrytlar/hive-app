"use client";

import { useEffect, useState } from "react";

/**
 * Basically, create the nested structure as topics arrive.
 *
 * Topics are not linked to the tree in any way. When a topic arrives we will find
 * the matching tree or create it.
 *
 * 1. topic arrives
 * 2. find topic in tree or add
 */

// const t = [
//   <Node mqttData={{ topic: "Test/Test/Test", message: "Hello" }} />,
//   <Node mqttData={{ topic: "Test/Test", message: "Hello" }} />,
//   <Node mqttData={{ topic: "Test/Test2", message: "Hello" }} />,
// ];

// t.forEach((element, index) => {
//   console.log(element.props);
// });

// // Sort based on amount of splits
// t.sort((a, b) => a.props.mqttData.topic.split("/").length - b.props.mqttData.topic.split("/").length);

// t.forEach((element, index) => {
//   console.log(element.props);
// });

// const list = ["Test/Test/Test", "Test/Test"];
// const tree = {};

// list.forEach((path) => {
//   const parts = path.split("/");
//   let current = tree;

//   parts.forEach((part) => {
//     if (!current[part]) {
//       current[part] = {};
//     }
//     current = current[part];
//   });
// });

// function Node({ mqttData }) {
//   const [topic, setTopic] = useState(mqttData.topic);
//   const [message, setMessage] = useState(mqttData.message);

//   return (
//     <details>
//       <summary>
//         <span>
//           {topic} {message && `= ${message}`}
//         </span>
//       </summary>
//       {children}
//     </details>
//   );
// }

// export function NestedTopicTree({ mqttData }) {
//   const [tree, setTree] = useState();

//   useEffect(() => {
//     if (mqttData) {
//       console.log(mqttData);
//       setTree(buildTree(mqttData));
//     }
//   }, [mqttData]);

//   // Build a tree of components
//   const buildTree = (obj) => {
//     const tree = {};

//     const parts = obj.topic.split("/");

//     parts.forEach((part, index) => {
//       if (index < parts.length - 1) {
//         <Node />;
//       } else {
//         <Node>Test</Node>;
//       }
//     });

//     return tree;
//   };

//   return t.forEach((element) => {});
//   return "loading";
//   return <>{!tree ? "Loading" : <div>{renderTree(tree)}</div>}</>;
// }

const TreeNode = ({ node, click, selectedItem, showData }) => {
  const keys = Object.keys(node);
  // const hasChildren = keys.some((key) => Object.keys(node[key].__children).length > 0);

  const renderNode = (key) => (
    <details open key={node[key].__topic}>
      <summary onClick={(event) => click(node[key])}>
        <span className={`fw-bold ${selectedItem?.__topic === node[key].__topic ? "text-decoration-underline" : ""}`}>{key}</span>
        {showData && node[key].__data && (
          <>
            {" = "}
            <span className="codeBlock">{JSON.stringify(node[key].__data)}</span>
          </>
        )}
      </summary>
      {Object.keys(node[key].__children).length > 0 && (
        <TreeNode node={node[key].__children} click={click} selectedItem={selectedItem} />
      )}
    </details>
  );

  const renderItem = (key) => (
    <div className="ms-3" key={node[key].__topic} onClick={(event) => click(node[key])}>
      <span>
        <span className={`fw-bold ${selectedItem?.__topic === node[key].__topic ? "text-decoration-underline" : ""}`}>{key}</span>
        {showData && (
          <>
            {" = "}
            <span className="codeBlock">{JSON.stringify(node[key].__data)}</span>
          </>
        )}
      </span>
    </div>
  );

  return <>{keys.map((key) => (!(Object.keys(node[key].__children).length > 0) ? renderItem(key) : renderNode(key)))}</>;
};

export function NestedTopicTree({ mqttData: listData, showData, handleSelect }) {
  const [selectedItem, setSelectedItem] = useState({});
  const tree = parseMqttDataToTree(listData);

  const handleClick = (event, id) => {
    setText(event.currentTarget.outerText);
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    handleSelect(item.__topic);
  };

  return (
    <>
      {selectedItem.__topic && false && (
        <>
          <p className="m-0">{selectedItem.__topic}</p>
          <p className="codeBlock">{JSON.stringify(listData[selectedItem.__topic])}</p>
          <details>
            <p>It would be great to be able to see messages here!</p>
            <p className="m-0">The problem is that objects are passed by reference, not value.</p>
            <p className="m-0">Is it possible to separate all topics into separate objects?</p>
            <p className="m-0">
              If this is possible, all components with the same topic could share the same data, and it would be possible to create
              functions like "history".
            </p>
            <p>We should give it a try!</p>
            <p className="m-0">First of remove this nested mess entirely and begin from scratch!</p>
            <p className="m-0">The first goal is to make a list of objects?</p>
          </details>
        </>
      )}
      <div className="bg-secondary d-inline-block rounded-3 p-2">
        <TreeNode node={tree} click={handleSelectItem} selectedItem={selectedItem} showData={showData} />
      </div>
    </>
  );
}

function parseMqttDataToTree(mqttData) {
  const tree = {};

  Object.keys(mqttData).forEach((path) => {
    const parts = path.split("/");
    let current = tree;
    let currentPath = "";

    parts.forEach((part, index) => {
      if (currentPath) {
        currentPath += "/";
      }
      currentPath += part;

      if (!current[part]) {
        current[part] = { __data: null, __topic: currentPath, __children: {} };
      }
      if (index === parts.length - 1) {
        current[part].__data = mqttData[path];
      }
      current = current[part].__children;
    });
  });

  return tree;
}

// const TreeNode = ({ node, click, selectedItem }) => {
//   return Object.keys(node).map((key) =>
//     !(Object.keys(node[key].__children).length > 0) ? (
//       // if node DOESNT have children
//       <div className="ms-3" key={node[key].__topic} onClick={(event) => click(node[key])}>
//         <span>
//           {/* {selectedItem?.__topic == node[key]?.__topic && "Selected! "} */}
//           <span className={`fw-bold ${selectedItem?.__topic === node[key]?.__topic ? "text-decoration-underline" : ""}`}>{key}</span>
//           {" = "}
//           <span className="codeBlock">{JSON.stringify(node[key].__data)}</span>
//         </span>
//         {/* {topic && <p className="m-0 fst-italic fs-6">{topic}</p>} */}
//       </div>
//     ) : (
//       // if node DOES have children
//       <details open key={key}>
//         <summary onClick={(event) => click(node[key])}>
//           {/* {selectedItem?.__topic == node[key]?.__topic && "Selected! "} */}
//           <span className={`fw-bold ${selectedItem?.__topic === node[key]?.__topic ? "text-decoration-underline" : ""}`}>{key}</span>
//           {node[key].__data && (
//             <>
//               {" = "}
//               <span className="codeBlock">{JSON.stringify(node[key].__data)}</span>
//             </>
//           )}
//         </summary>
//         {/* {topic && <p className="m-0 fst-italic fs-6">{topic}</p>} */}
//         {Object.keys(node[key].__children).length > 0 && (
//           <TreeNode node={node[key].__children} key={node[key].__topic} click={click} selectedItem={selectedItem} />
//         )}
//       </details>
//     )
//   );
// };
