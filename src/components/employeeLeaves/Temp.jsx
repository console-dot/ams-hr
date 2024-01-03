import { useEffect, useRef, useState } from "react";
import { BreadCurmbs, Status } from "../genralComponents";
import { useNavigate } from "react-router-dom";
import { useToastState } from "../../context";
import { fetchAllLeaves, markLeave } from "../../api";
import { convertDate } from "../attendanceTable";
import { ImCross } from "react-icons/im";
export const Temp = () => {
    const [attData, setAttData] = useState([]);
    const [dataToChange, setDataToChange] = useState([]);
  const getLeaves = async () => {
    const data = await fetchAllLeaves();
    const ids = [];
    const employee = {};
    data.data.forEach((i) => {
      if (!ids.includes(i?.employeeId?._id)) {
        ids.push(i.employeeId._id);
        employee[i.employeeId._id] = {
          id: i.employeeId.employeeId,
          name: i.employeeId.name,
          department: i.employeeId?.designation?.title,
        };
      }
    });
    const getLeaveDatesById = (id) => {
      return data.data
        .filter((i) => i?.employeeId?._id === id)
        .map((i) => i?.leaveDate?.split("T")[0])
        .sort((a, b) => a - b)
        .reverse();
    };
    const leaves = {};
    ids.forEach((i) => {
      leaves[i] = getLeaveDatesById(i);
    });
    const getConsectiveLeaves = (arr) => {
      const final = [];
      let temp = [];
      arr.forEach((_, index) => {
        const curr = new Date(arr[index]);
        const nextDate = new Date(arr[index + 1]);
        const oneDay = 1000 * 60 * 60 * 24;
        if (
          index === arr.length - 1 ||
          nextDate.getTime() / oneDay - curr.getTime() / oneDay === 1
        ) {
          const tempDate = new Date(_);
          temp.push(tempDate);
        } else {
          const tempDate = new Date(_);
          temp.push(tempDate);
          final.push(temp);
          temp = [];
        }
      });
      final.push(temp);
      return final;
    };
    const finalArr = [];
    Object.keys(leaves).forEach((i) => {
      employee[i].leaves = getConsectiveLeaves(leaves[i]);
      finalArr.push(employee[i]);
    });
    setAttData(finalArr);
    setDataToChange(finalArr);
  };
  useEffect(() => {
    getLeaves();
  }, []);
  return (
    <div className="overflow-hidden overflow-y-scroll ">
      <div className="w-full mb-4">{/* <BreadCurmbs data={bData} /> */}</div>
      <div className="w-full gap-2 flex justify-start flex-col items-center px-4 mb-2 lg:flex-row lg:justify-start">
        <div className="w-full  flex  items-center gap-2  ">
          <label htmlFor="search" className="sm:min-w-[50px] text-[#7a7a7a]">
            From
          </label>
          <input
            type="date"
            id="start-date"
            placeholder="Starting Date"
            className="input input-ligt input-dark input-bordered w-full "
          />
        </div>
        <div className="w-full  flex  items-center gap-2 ">
          <label htmlFor="search" className="sm:min-w-[50px] text-[#7a7a7a]">
            To
          </label>
          <input
            type="date"
            id="end-date"
            placeholder="Ending Date (optional)"
            className="input input-ligt input-dark input-bordered w-full "
          />
        </div>
        <div className="w-full  flex  items-center gap-2  ">
          <label htmlFor="search" className="sm:min-w-[50px] text-[#7a7a7a]">
            ID
          </label>
          <input
            type="text"
            id="empId"
            placeholder="ID (Optional)"
            className="input input-ligt input-dark input-bordered w-full  "
          />
        </div>
        <div className="w-full flex justify-between items-center">
          <button className="btn border border-gray-400 mr-2">Search</button>

          <button
            className="btn bg-[#186080] text-slate-100 "
            onClick={() => document.getElementById("leave-modal").showModal()}
          >
            Mark Leave
          </button>
        </div>
      </div>
      <div className="w-full flex justify-end flex-col items-end px-4  ">
        <input
          type="text"
          id="search"
          placeholder="Ctrl+k to search"
          className="max-w-lg input input-sm underline focus:border-none border-none focus:no-underline"
          //   ref={employeeId}
          //   onChange={handleSearch}
        />
      </div>
      <div className=" overflow-x-auto">
        <table className="table table-zebra-zebra table-lg mb-2  ">
          <thead>
            <tr>
              <th className="px-3">Employee ID</th>
              <th>Employee Name</th>
              <th>Department</th>
              <th>Leave Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dataToChange?.map((obj, index) => {
              return obj?.leaves?.map((i, ind) => (
                <tr key={ind}>
                  <th className="px-2">{obj?.id}</th>
                  <td className="px-2"> {obj?.name} </td>
                  <td className="px-2">{obj?.department}</td>
                  <td className=" px-2">
                    {i.length > 1
                      ? `${convertDate(i[0])} to ${convertDate(
                          i[i.length - 1]
                        )}`
                      : `${convertDate(i[0])}`}
                  </td>
                  <td className={`h-full`}>
                    <span
                      className={`capitalize p-4 badge flex justify-center  items-center bg-green-500`}
                    >
                      Approved
                    </span>
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
      <div className="w-full flex justify-end items-end">
        {/* {renderPaginationButtons()} */}
      </div>

      {/* <dialog id="leave-modal" className="modal ">
        <div className="modal-box ">
          <div className="modal-action mt-0 mb-2">
            <form method="dialog">
              <button>
                <ImCross />
              </button>
            </form>
          </div>
          <p className="tex-xl font-bold mb-4">Mark employee leave</p>
          <div className="w-full  flex justify-between items-center mb-2 gap-2">
            <label htmlFor="start-date " className="text-[#7a7a7a]">
              From
            </label>
            <input
              type="date"
              id="start-date"
              placeholder="Starting Date"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) =>
                setSearchParams({ ...searchParams, start: e.target.value })
              }
            />
          </div>
          <div className="w-full  flex justify-between items-center mb-2 gap-2">
            <label htmlFor="end-date  " className="text-[#7a7a7a]">
              To
            </label>
            <input
              type="date"
              id="end-date"
              placeholder="Ending Date (optional)"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) =>
                setSearchParams({ ...searchParams, end: e.target.value })
              }
            />
          </div>

          <div className="w-full  flex justify-between items-center gap-2 ">
            <label htmlFor="eId" className="text-[#7a7a7a]">
              Employee ID
            </label>
            <input
              type="text"
              id="eId"
              placeholder="ID "
              className="input input-bordered w-full max-w-xs"
              onChange={(e) =>
                setSearchParams({ ...searchParams, empId: e.target.value })
              }
            />
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={handleLeave}>
                Mark Leave
              </button>
            </form>
          </div>
        </div>
      </dialog> */}
    </div>
  );
};
