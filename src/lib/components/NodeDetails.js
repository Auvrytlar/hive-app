import { ModulesCard } from "./ModulesCard";
import { MQTTObservations } from "@components/MQTTObservations";

export function NodeDetails({ node, mySeparatedModules, records }) {
  return (
    <div className="fill text-start">
      <h1 className="ps-2">Node: {node.nName || "Unnamed"}</h1>
      <div className="container">
        <p className="code">UID {node.nHardwareUID}</p>

        <MQTTObservations nodeID={node} />

        {!mySeparatedModules || mySeparatedModules.length === 0 ? (
          "Loading data..."
        ) : (
          <>
            {mySeparatedModules.map((moduleOfType, index) => (
              <ModulesCard key={index} moduleOfType={moduleOfType} records={records} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
