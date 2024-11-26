"use client";

import { ClusterProvider } from "@lib/context/clusterContext";
import ErrorBoundary from "@lib/context/ErrorBoundary";
import React from "react";

export default function RootLayout({ children }) {
  return (
    <>
      <ErrorBoundary fallback={<p>Something went wrong</p>}>
        <ClusterProvider>{children}</ClusterProvider>
      </ErrorBoundary>
    </>
  );
}

// let l = JSON.stringify(getCluster());
// let s = JSON.parse(l);

// return <>{React.cloneElement(children, { Test: "Test" })}</>;
