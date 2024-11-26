"use client";
import { useEffect, useState } from "react";

import { useCluster } from "@lib/context/clusterContext";
import { NodeDetails } from "@components/NodeDetails";
import ErrorPage from "next/error";
import { useLocation } from "react-use";

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
