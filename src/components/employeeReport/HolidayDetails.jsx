import React from "react";
import { convertDate } from "../attendanceTable";

export const HolidayDetails = ({ holiday }) => {
  console.log(holiday);
  return (
    <div className="w-full">
      {holiday?.length > 0 ? (
        <table className="table table-lg mb-2">
          {/* head */}
          <thead>
            <tr>
              <th>Date </th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {holiday?.map((obj, index) => (
              <tr key={index}>
                <th>{convertDate(obj?.holidayDate, "full")}</th>
                <td className="flex items-center justify-start gap-2 ">
                  {obj?.reasonForLeave}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-sm font-medium py-4 px-6">
          No holiday record.
        </p>
      )}
    </div>
  );
};
