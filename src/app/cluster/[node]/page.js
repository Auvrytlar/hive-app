"use client";
import { useEffect, useState } from "react";

import { useCluster } from "@lib/context/clusterContext";
import { NodeDetails } from "@components/NodeDetails";
import ErrorPage from "next/error";

export default function Page({ params }) {
  const [loading, setLoading] = useState(true);
  const { cluster } = useCluster();
  const [node, setNode] = useState(null);
  const [mySeparatedModules, setSeparatedModules] = useState(null);

  useEffect(() => {
    // Find node
    if (cluster) {
      let foundNode = cluster.find((a) => a._id == params.node);
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
