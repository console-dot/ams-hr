import React from "react";
import { GenralLayout } from "../themes";
import { PublicHolidaysComponent } from "../components";

export const PublicHolidaysPage = () => {
  return (
    <GenralLayout>
      <div className="p-4">
        <PublicHolidaysComponent />
      </div>
    </GenralLayout>
  );
};
