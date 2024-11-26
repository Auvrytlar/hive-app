"use client";

import LineChart from "@components/LineChart";
import { MqttInteractions } from "@components/mqttInteractions";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useCluster } from "@lib/context/clusterContext";
// import { useCallback, useState, useEffect, useContext } from "react";

export default function Page({ params }) {
  const { cluster, records, getRecord } = useCluster();
  const [module, setModule] = useState(null);

  useEffect(() => {
    if (cluster) {
      cluster.forEach((node) => {
        let test = node.nModules.find((module) => module._id == params.module);
        if (test) {
          setModule(test);
          return;
        }
      });
    }
  }, [cluster]);

  return (
    <>
      {!module ? (
        "The server is unable to find a Node with this ID." + "\nIt probably does not exist"
      ) : (
        <>
          <div className="fill text-start ">
            <h1 className="ps-2 ">{module.mName || "Unnamed Node"}</h1>
            <div className="container ">
              <p className="code">{module.mHardwareUID}</p>

              <LineChart arrayOfModules={[module]} arrayOfRecords={records} callback={getRecord} legend={true} />
            </div>
          </div>
          <pre>{JSON.stringify(module, null, 2)}</pre>
        </>
      )}
    </>
  );
}
