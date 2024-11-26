import Link from "next/link";
import { PrintObject } from "./temp/printObject";

export default function NodeCard({ node }) {
  return (
    // <>
    //   <div className="card">
    //     <h3>{node.nName ? node.nName : "no name"}</h3>
    //     <p>
    //       UID: <span className="code">{node.nHardwareUID ? node.nHardwareUID : "no name"}</span>
    //     </p>
    //     <ul>
    //       {node.nModules.map((a) => {
    //         return <li key={a.mHardwareUID}>{a.mHardwareUID}</li>;
    //       })}
    //     </ul>
    //   </div>
    // </>
    <>
      <div className="card border border-2 text-black d-flex flex-row m-1 p-1">
        <div>
          <h2>
            <Link href={`/cluster/${node._id}`} className="text-black">
              {node.nName || `Unnamed (${node.nHardwareUID})`}
            </Link>
          </h2>
          <ul className="list-group list-unstyled">
            <li>
              HardwareUID: <span className="code">{node.nHardwareUID}</span>
            </li>
            <li>
              Modules: <span className="code">{node.nModules.length}</span>
            </li>
          </ul>
        </div>

        <div className="Chart-Small ms-2">
          {/* <LineChart arrayOfModules={node.nModules} arrayOfRecords={records} callback={addToWatchlist} alignTicks={false} legend={false} showX={false} /> */}
        </div>
      </div>
    </>
  );
}
