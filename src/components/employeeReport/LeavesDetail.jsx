import React from "react";
import { convertDate } from "../attendanceTable";

export const LeavesDetail = ({ leaves }) => {
  return (
    <div className="w-full">
      {leaves?.length > 0 ? (
        <table className="table table-lg mb-2">
          {/* head */}
          <thead>
            <tr>
              <th>Date </th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves?.map((obj, index) => (
              <tr key={index}>
                <th>{convertDate(obj?.leaveDate, "full")}</th>
                <td className="flex items-center justify-start gap-2 ">
                  {convertDate(obj?.endDate, "full")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-sm font-medium py-4 px-6">
          No leave record.
        </p>
      )}
    </div>
  );
};
