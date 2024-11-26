"use client";

import NodeCard from "@components/nodeCard";
import { useCluster } from "@lib/context/clusterContext";

export default function ListNodesFromCluster() {
  const { cluster } = useCluster();

  return (
    <>
      {cluster.map((node) => {
        return <NodeCard key={node._id} node={node} />;
      })}
    </>
  );
}
