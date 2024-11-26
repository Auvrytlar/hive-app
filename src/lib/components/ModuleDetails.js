"use client";
import { ModuleTable } from "./ModuleTable";


export function ModuleDetails({ moduleOfType }) {
  return (
    <div className="p-1">
      <p>(Sensor)</p>
      <h2>{moduleOfType.type}</h2>
      {/* <ul className="list-group list-group-flush"> */}
      <ModuleTable moduleOfType={moduleOfType} />
      {/* </ul> */}
    </div>
  );
}
