import { useEffect, useRef, useState } from "react";
import { convertDate } from "../attendanceTable";
import { Status } from "../genralComponents";

export const GenralReport = ({ data, active }) => {
  const [tempData, setTempData] = useState(data);
  const returnDaysReport = () => {
    if (active === "full" || active === "half") {
      return data?.filter((obj) => obj?.status === active);
    }
    if (active === "report") {
      return data;
    }
    return data;
  };

  useEffect(() => {
    setTempData(data);
  }, [data]);

  useEffect(() => {
    setTempData(returnDaysReport());
  }, [active]);

  return (
    <div className="w-full">
      <table className="table table-lg mb-2">
        {/* head */}
        <thead>
          <tr>
            <th>date</th>
            <th>Login Time</th>
            <th>Logout Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tempData?.length > 0 ? (
            tempData?.map((obj, index) => (
              <tr key={index}>
                <th>{convertDate(obj?.checkin, "monthAndDay")}</th>
                <td className="flex items-center justify-start gap-2 ">
                  {convertDate(obj?.checkin, "full")}
                  <Status time={obj?.checkin} />
                </td>
                <td> {convertDate(obj?.checkout, "full")} </td>
                <td className="capitalize no-underline">
                  {obj?.status ? obj?.status + " " + `day` : "On going"}
                </td>
              </tr>
            ))
          ) : (
            <p>No record found</p>
          )}
        </tbody>
      </table>
    </div>
  );
};
