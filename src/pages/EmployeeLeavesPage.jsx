import React from "react";
import { GenralLayout } from "../themes";
import { EmployeeLeaves } from "../components";

export const EmployeeLeavesPage = () => {
  return (
    <GenralLayout>
      <div className="p-4">
        <EmployeeLeaves />
      </div>
    </GenralLayout>
  );
};
