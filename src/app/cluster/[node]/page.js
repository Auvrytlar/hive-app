"use client";
import { useEffect, useState } from "react";

import { useCluster } from "@lib/context/clusterContext";
import { NodeDetails } from "@components/NodeDetails";
import ErrorPage from "next/error";
import { useLocation } from "react-use";
import { getCluster } from "@/lib/mongodb/cluster";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const { cluster } = useCluster();
  const [node, setNode] = useState(null);
  const [mySeparatedModules, setSeparatedModules] = useState(null);

  // console.log(window.location.pathname);
  // console.log(props.location);
  const parts = useLocation().pathname.split("/");
  const nodeid = parts[2];

  useEffect(() => {
    // Find node
    if (cluster && nodeid) {
      let foundNode = cluster.find((a) => a._id == nodeid);
      if (foundNode) {
        setNode(foundNode);
      } else setLoading(false);
    }
  }, [cluster]);

  useEffect(() => {
    if (node) {
      setSeparatedModules(
        Object.values(
          node.nModules.reduce((acc, module) => {
            const { mType } = module;
            if (!acc[mType]) {
              acc[mType] = { type: mType, modules: [] };
            }
            acc[mType].modules.push(module);
            return acc;
          }, {})
        )
      );
      setLoading(false);
    }
  }, [node]);

  // if (!nodeFound) return <ErrorPage statusCode={404} />;
  // else
  return (
    <>
      {loading ? (
        "Loading data..."
      ) : !node ? (
        <ErrorPage statusCode={404} />
      ) : (
        <NodeDetails node={node} mySeparatedModules={mySeparatedModules} />
      )}
    </>
  );
}

// // app/nodes/[nodeId]/page.js
// import { getCluster } from "@/lib/mongodb/cluster";
// import { NodeDetails } from "@components/NodeDetails";
// import ErrorPage from "next/error";

// export async function generateStaticParams() {
//   const cluster = await getCluster();
//   return cluster.map((node) => ({
//     nodeId: node._id,
//   }));
// }

// export default async function NodePage({ params }) {
//   const { nodeId } = params;

//   const cluster = await getCluster();

//   // Find the node by ID
//   const node = cluster.find((a) => a._id === nodeId);

//   if (!node) {
//     // Return 404 if the node is not found
//     return <ErrorPage statusCode={404} />;
//   }

//   // Separate modules by type
//   const separatedModules = Object.values(
//     node.nModules.reduce((acc, module) => {
//       const { mType } = module;
//       if (!acc[mType]) {
//         acc[mType] = { type: mType, modules: [] };
//       }
//       acc[mType].modules.push(module);
//       return acc;
//     }, {})
//   );

//   return <NodeDetails node={node} mySeparatedModules={separatedModules} />;
// }
