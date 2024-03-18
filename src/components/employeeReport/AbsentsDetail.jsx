import React from "react";
import { convertDate, convertDateWithoutTime } from "../attendanceTable";

export const AbsentsDetail = ({ absents }) => {
  return (
    <div className="w-full">
      {absents?.length > 0 ? (
        <table className="table table-lg mb-2">
          {/* head */}
          <thead>
            <tr>
              <th>Date </th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {absents?.map((obj, index) => (
              <tr key={index}>
                <th>{convertDateWithoutTime(obj, "full")}</th>
                <td className="flex items-center justify-start gap-2 ">--</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-sm font-medium py-4 px-6">
          No absents record.
        </p>
      )}
    </div>
  );
};
