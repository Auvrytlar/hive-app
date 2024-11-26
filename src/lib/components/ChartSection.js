"use client";
import LineChart from "@components/LineChart";
import { Suspense } from "react";
import { useCluster } from "@lib/context/clusterContext";

export function ChartSection({ moduleOfType }) {
  const { records, getRecord } = useCluster();
  
  return (
    <div className="p-2 m-0 w-100">
      <div style={{ width: 100+"%", height: 400+"px" }}>

        <Suspense fallback={<p>Loading chart...</p>}>
          <LineChart arrayOfModules={moduleOfType.modules} arrayOfRecords={records} callback={getRecord} legend={true} />
        </Suspense>
      </div>
    </div>
  );
}
