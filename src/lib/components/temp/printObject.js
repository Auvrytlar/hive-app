"use client";

import { useCluster } from "@lib/context/clusterContext";

export function PrintObject({ obj }) {
  return <pre className="codeBlock">{JSON.stringify(obj, null, 2)}</pre>;
}

export function PrintCluster() {
  const { cluster } = useCluster();

  return <PrintObject obj={cluster} />;
}

// Bootstrap: "badge bg-secondary"
