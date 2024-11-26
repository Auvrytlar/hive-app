"use client";
import { PrintCluster, PrintObject } from "@/lib/components/temp/printObject";
import Image from "next/image";
import { useCluster } from "@lib/context/clusterContext";
import NodeCard from "@/lib/components/nodeCard";

export default function Home() {
  const { cluster } = useCluster();
  return (
    <>
      {cluster.map((a) => {
        return <NodeCard node={a} key={a._id} />;
      })}
      <PrintObject obj={cluster} />
    </>
  );
}
