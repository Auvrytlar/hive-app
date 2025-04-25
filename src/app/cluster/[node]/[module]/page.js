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

// // app/nodes/[nodeId]/[moduleId]/page.js
// import LineChart from "@components/LineChart";
// import { getCluster, getRecords } from "@/lib/mongodb/cluster"; // Update this import to match your data fetching method
// import ErrorPage from "next/error";

// export async function generateStaticParams() {
//   const cluster = await getCluster();
//   const params = [];

//   cluster.forEach((node) => {
//     node.nModules.forEach((module) => {
//       params.push({ nodeId: node._id, moduleId: module._id });
//     });
//   });

//   return params;
// }

// export default async function ModulePage({ params }) {
//   const { nodeId, moduleId } = params;

//   // Fetch data
//   const cluster = await getCluster();
//   const records = await getRecords(); // Assuming you have a function to fetch records

//   // Find the module
//   let module = null;
//   const node = cluster.find((node) => node._id === nodeId);

//   if (node) {
//     module = node.nModules.find((mod) => mod._id === moduleId);
//   }

//   if (!module) {
//     return <ErrorPage statusCode={404} message="The server is unable to find a Node with this ID. It probably does not exist." />;
//   }

//   return (
//     <div className="fill text-start">
//       <h1 className="ps-2">{module.mName || "Unnamed Node"}</h1>
//       <div className="container">
//         <p className="code">{module.mHardwareUID}</p>
//         <LineChart
//           arrayOfModules={[module]}
//           arrayOfRecords={records}
//           callback={() => {}} // Replace with your desired callback function if applicable
//           legend={true}
//         />
//       </div>
//       <pre>{JSON.stringify(module, null, 2)}</pre>
//     </div>
//   );
// }
