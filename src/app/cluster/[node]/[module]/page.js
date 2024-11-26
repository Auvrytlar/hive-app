"use client";

import LineChart from "@components/LineChart";
import { MqttInteractions } from "@components/mqttInteractions";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useCluster } from "@lib/context/clusterContext";
import { useLocation } from "react-use";
// import { useCallback, useState, useEffect, useContext } from "react";

export default function Page() {
  const { cluster, records, getRecord } = useCluster();
  const [module, setModule] = useState(null);

  const parts = useLocation().pathname.split("/");
  const nodeid = parts[2];
  const moduleid = parts[3];

  console.log(nodeid);
  console.log(moduleid);

  useEffect(() => {
    if (cluster && moduleid) {
      cluster.forEach((node) => {
        let test = node.nModules.find((module) => module._id == moduleid);
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

// export async function generateStaticParams() {
//   const rows = await query('SELECT category, id FROM products');

//   return rows.map((row) => ({
//     categorySlug: row.category,
//     productId: row.id,
//   }));
// }
