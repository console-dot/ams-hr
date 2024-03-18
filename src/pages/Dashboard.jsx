import React from "react";
import { GenralLayout } from "../themes";
import { AttendanceTable } from "../components";

export const Dashboard = () => {
  return (
    <GenralLayout>
      <div className=" p-4">
        <AttendanceTable />
        
      </div>
    </GenralLayout>
  );
};
