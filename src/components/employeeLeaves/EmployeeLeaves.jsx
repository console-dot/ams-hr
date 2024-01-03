import { useEffect, useRef, useState } from "react";
import { BreadCurmbs } from "../genralComponents";
import { useToastState } from "../../context";
import { fetchAllLeaves, getAllAttendace, markLeave } from "../../api";
import { convertDate } from "../attendanceTable";
import { ImCross } from "react-icons/im";
export const EmployeeLeaves = () => {
  const [attData, setAttData] = useState([]);
  const [constData, setConstData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterParams, setFilterParams] = useState({
    start: "",
    end: "",
    empId: "",
  });
  const employeeId = useRef();
  const { dispatch } = useToastState();

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const renderPaginationButtons = () => {
    return (
      <div className="join">
        <button
          className="join-item btn btn-outline  w-40 text-slate-100 bg-[#166583]"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous page
        </button>
        <button
          className="join-item btn btn-outline w-40 text-slate-100 bg-[#166583]"
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
        >
          Next
        </button>
      </div>
    );
  };

  const handleSearch = async () => {
    setSearchQuery(employeeId?.current.value);
    setCurrentPage(1);
  };

  const searchCall = async () => {
    try {
      if (
        filterParams.empId === "" &&
        filterParams.start === "" &&
        filterParams.end === ""
      ) {
        setFilteredData(attData);
        return;
      }
      const oneDay = 1000 * 24 * 60 * 60;
      const s = new Date(filterParams.start);
      const e = new Date(filterParams.end);
      if (e.getTime() / oneDay - s.getTime() / oneDay < 0) {
        setFilteredData(attData);
        dispatch({
          type: "ERROR",
          payload: "Start date should be less than end date",
        });
        return;
      }
      const id = filterParams.empId;
      if (id !== "") {
        const tempData = [];
        attData.forEach((obj) => {
          const tempObj = { ...obj };
          const temp = tempObj.leaves.filter((att) => {
            const leaves = att.map((i) => i.getTime());
            return (
              s.getTime() <= leaves[0] &&
              leaves[leaves.length - 1] <= e.getTime() &&
              id === tempObj.id
            );
          });
          tempObj.leaves = temp;
          tempData.push(tempObj);
        });
        setFilteredData(tempData);
      } else {
        const tempData = [];
        attData.forEach((obj) => {
          const tempObj = { ...obj };
          const temp = tempObj.leaves.filter((att) => {
            const leaves = att.map((i) => i.getTime());
            return (
              s.getTime() <= leaves[0] &&
              leaves[leaves.length - 1] <= e.getTime()
            );
          });
          tempObj.leaves = temp;
          tempData.push(tempObj);
        });
        setFilteredData(tempData);
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: "ERROR", payload: "Provide valid search params" });
      return;
    }
  };
  const getLeaves = async () => {
    const data = await fetchAllLeaves();
    const ids = [];
    const employee = {};
    setConstData(data?.data);
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
    setAttData([...finalArr]);
    setFilteredData([...finalArr]);
  };
  const handleLeave = async () => {
    try {
      const res = await markLeave(filterParams);
      if (res.status === 201) {
        dispatch({
          type: "SUCCESS",
          payload: res?.message,
        });
      } else {
        dispatch({
          type: "ERROR",
          payload: res.message,
        });
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: "ERROR",
        payload: res.message,
      });
    }
  };
  let visited = false;
  useEffect(() => {
    if (!visited) {
      getLeaves();
      visited = true;
    }
  }, []);
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        const searchInput = document.getElementById("search");
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);
  const getStatus = (date) => {
    const validDate = new Date(date);
    const today = new Date();
    if (validDate?.getTime() > today?.getTime()) {
      return "Pending";
    }
    return "Approved";
  };
  const bData = [
    { text: "Home", link: "/dashboard" },
    { text: "Dashboard", link: "/dashboard" },
    { text: "Employee Leaves", link: "/dashboard", status: "active" },
  ];
  return (
    <div className="overflow-hidden overflow-y-scroll ">
      <div className="w-full mb-4">
        <BreadCurmbs data={bData} />
      </div>
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
            onChange={(e) =>
              setFilterParams({ ...filterParams, start: e.target.value })
            }
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
            onChange={(e) =>
              setFilterParams({ ...filterParams, end: e.target.value })
            }
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
            onChange={(e) =>
              setFilterParams({ ...filterParams, empId: e.target.value })
            }
          />
        </div>
        <div className="w-full flex justify-between items-center">
          <button
            className="btn border border-gray-400 mr-2"
            onClick={searchCall}
          >
            Filter
          </button>

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
          ref={employeeId}
          onChange={handleSearch}
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
            {currentData?.map((obj, index) => {
              return obj?.leaves?.map((i, ind) => (
                <tr key={ind}>
                  <th className="px-2">{obj?.id}</th>
                  <td className="px-2"> {obj?.name} </td>
                  <td className="px-2">{obj?.department}</td>
                  <td className=" px-2">
                    {i.length > 1
                      ? `${convertDate(i[0], "monthAndDay")} to ${convertDate(
                          i[i.length - 1],
                          "monthAndDay"
                        )}`
                      : `${convertDate(i[0], "monthAndDay")}`}
                  </td>
                  <td className={`h-full`}>
                    <span
                      className={`capitalize p-4 badge flex justify-center  items-center${
                        i.length > 1
                          ? `${
                              getStatus(i[i.length - 1]) === "Pending"
                                ? "bg-yellow-100"
                                : "bg-green-100"
                            }`
                          : `${
                              getStatus(i[0]) === "Pending"
                                ? "bg-yellow-100"
                                : "bg-green-100"
                            }`
                      }`}
                    >
                      {i.length > 1
                        ? `${getStatus(i[i.length - 1])}`
                        : `${getStatus(i[0])}`}
                    </span>
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
      <div className="w-full flex justify-end items-end">
        {renderPaginationButtons()}
      </div>

      <dialog id="leave-modal" className="modal ">
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
                setFilterParams({ ...filterParams, start: e.target.value })
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
                setFilterParams({ ...filterParams, end: e.target.value })
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
                setFilterParams({ ...filterParams, empId: e.target.value })
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
      </dialog>
    </div>
  );
};
