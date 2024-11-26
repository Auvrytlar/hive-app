"use client";

import Link from "next/link";
import { Switch } from "@components/Switch";
import rgbFromSeed from "@lib/scripts/rgbFromSeed";

export function ModuleTable({ moduleOfType }) {
  const toggleModule = () => {};

  return (
    <table className="table table-sm table-striped table-hover caption-top">
      <thead>
        <tr>
          <th scope="col">UID</th>
          <th scope="col">Listen</th>
        </tr>
      </thead>
      <tbody>
        {moduleOfType.modules.map((module, moduleIndex) => (
          <tr key={moduleIndex}>
            <td>
              <Link
                href={`${window.location.pathname}/${module._id}`}
                color={rgbFromSeed(module._id)}
                className="text-decoration-none"
              >
                {module.mName ? module.mName : module.mHardwareUID}
              </Link>
            </td>
            <td>
              <Switch state={true} onChange={toggleModule} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
