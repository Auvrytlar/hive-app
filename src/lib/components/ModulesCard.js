"use client";
import { ChartSection } from "@components/ChartSection";
import { ModuleDetails } from "@components/ModuleDetails";

export function ModulesCard({ moduleOfType }) {
  return (
    <>
      <div className="card container-fluid d-flex flex-column flex-md-row justify-content-between">
        <ModuleDetails moduleOfType={moduleOfType} />
        <ChartSection moduleOfType={moduleOfType} />
      </div>
      <hr className="m-4" />
    </>
  );
}
