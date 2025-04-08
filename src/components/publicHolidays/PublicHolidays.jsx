import { useEffect, useRef, useState } from "react";
import { BreadCurmbs } from "../genralComponents";
import { useToastState } from "../../context";
import { fetchAllHolidays, markHoliday, markLeave } from "../../api";

import { ImCross } from "react-icons/im";
export const PublicHolidaysComponent = () => {
  const [searchParams, setSearchParams] = useState({
    reason: "",
    start: "",
    end: "",
  });
  const [constData, setConstData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterParams, setFilterParams] = useState({
    start: "",
    end: "",
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

  const convertToPKT = (dateStr) => {
    const date = new Date(dateStr);
    const timeZoneOffset = 5 * 60; // PKT is UTC+5
    date.setMinutes(date.getMinutes() + timeZoneOffset);
    return date.toISOString().split("T")[0]; // Return as YYYY-MM-DD
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
      // If no filter parameters are provided, reset to the original data
      if (filterParams.start === "" && filterParams.end === "") {
        setFilteredData(constData);
        return;
      }

      // Convert start and end date to date objects
      const s = new Date(filterParams.start);
      const e = new Date(filterParams.end);

      // Ensure start date is less than end date
      if (e.getTime() < s.getTime()) {
        setFilteredData(constData); // Reset to original data if invalid date range
        dispatch({
          type: "ERROR",
          payload: "Start date should be less than end date",
        });
        return;
      }

      // Filter data based on the holiday date range
      const tempData = constData.filter((obj) => {
        const holidayStart = new Date(obj?.holidayDate).getTime();
        const holidayEnd = obj?.endHolidayDate
          ? new Date(obj?.endHolidayDate).getTime()
          : holidayStart;

        // Check if the holiday date is within the start and end range
        return holidayStart >= s.getTime() && holidayEnd <= e.getTime();
      });

      setFilteredData(tempData); // Set filtered data based on date range
    } catch (error) {
      console.log(error);
      dispatch({ type: "ERROR", payload: "Provide valid search params" });
    }
  };

  const getPublicHolidays = async () => {
    try {
      const data = await fetchAllHolidays();
      const holidays = data?.data || [];

      // Convert holiday dates to PKT
      const formattedHolidays = holidays.map((holiday) => ({
        ...holiday,
        holidayDate: convertToPKT(holiday?.holidayDate),
        endHolidayDate: holiday?.endHolidayDate
          ? convertToPKT(holiday?.endHolidayDate)
          : "", // Ensure endHolidayDate is converted if available
      }));

      setFilteredData(formattedHolidays);
      setConstData(formattedHolidays);
    } catch (error) {
      console.error("Error fetching holidays:", error);
      dispatch({
        type: "ERROR",
        payload: "Failed to load public holidays",
      });
    }
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
    }
  };
  let visited = false;
  useEffect(() => {
    if (!visited) {
      getPublicHolidays();
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

  const bData = [
    { text: "Home", link: "/dashboard" },
    { text: "Dashboard", link: "/dashboard" },
    { text: "Public Holidays", link: "/dashboard", status: "active" },
  ];
  const handlePublicLeave = async () => {
    try {
      if (searchParams.start && searchParams.end) {
        const startDate = new Date(searchParams.start);
        const endDate = new Date(searchParams.end);
        if (endDate <= startDate) {
          dispatch({
            type: "ERROR",
            payload: "End date must be greater than start date.",
          });
          return;
        }
      } 
      const res = await markHoliday(searchParams);
      if (res.status === 201) {
        dispatch({
          type: "SUCCESS",
          payload: res?.message,
        });
        getPublicHolidays();
        setSearchParams({ end: "", start: "", reason: "" });
      } else {
        dispatch({
          type: "ERROR",
          payload: res.message,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  const calculateHolidayCount = (startDate, endDate) => {
    const start = new Date(startDate);
    let end = endDate ? new Date(endDate) : start;

    const timeDifference = end.getTime() - start.getTime();
    const dayCount = timeDifference / (1000 * 3600 * 24) + 1;
    return dayCount;
  };
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);

    const options = {
      year: "numeric",
      month: "short", // e.g., Jan, Feb, Mar
      day: "numeric",
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
  };
  const clearFilter = () => {
    setFilterParams({ start: "", end: "" });
    getPublicHolidays();
  };
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
            value={filterParams.start}
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
            value={filterParams.end}
            placeholder="Ending Date (optional)"
            className="input input-ligt input-dark input-bordered w-full "
            onChange={(e) =>
              setFilterParams({ ...filterParams, end: e.target.value })
            }
          />
        </div>
        {/* <div className="w-full  flex  items-center gap-2  ">
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
        </div> */}
        <div className="w-full flex justify-between items-center">
          <button className="btn border border-gray-400 " onClick={searchCall}>
            Filter
          </button>
          {filterParams.start.length > 0 && filterParams.end.length > 0 && (
            <>
              {" "}
              <button
                className="btn border border-gray-400"
                onClick={clearFilter}
              >
                clear
              </button>
            </>
          )}

          <button
            className="btn bg-[#186080] text-slate-100 "
            onClick={() =>
              document.getElementById("public-leave-modal").showModal()
            }
          >
            Add Public Holiday
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
              <th className="px-3">Holiday Date</th>
              <th>Holiday Reason</th>
              <th>Holiday Count</th>
            </tr>
          </thead>
          <tbody>
            {currentData?.map((obj, index) => {
              const holidayCount = calculateHolidayCount(
                obj?.holidayDate,
                obj?.endHolidayDate
              );
              return (
                <tr>
                  <th className="px-2">
                    {formatDate(obj?.holidayDate)}{" "}
                    {obj?.endHolidayDate && "<->"}{" "}
                    {obj?.endHolidayDate ? formatDate(obj?.endHolidayDate) : ""}
                  </th>
                  <td className="px-2">{obj?.reasonForLeave}</td>
                  <td className="px-2">{holidayCount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="w-full flex justify-end items-end">
        {renderPaginationButtons()}
      </div>

      <dialog id="public-leave-modal" className="modal ">
        <div className="modal-box ">
          <div className="modal-action mt-0 mb-2">
            <form method="dialog">
              <button>
                <ImCross />
              </button>
            </form>
          </div>
          <p className="tex-xl font-bold mb-4">Mark Public leave</p>
          <div className="w-full  flex justify-between items-center mb-2 gap-2">
            <label htmlFor="public-date " className="text-[#7a7a7a]">
              start date
            </label>
            <input
              type="date"
              id="public-date"
              placeholder="Date"
              value={searchParams.start}
              className="input input-bordered w-full max-w-xs"
              onChange={(e) =>
                setSearchParams({
                  ...searchParams,
                  start: e.target.value,
                })
              }
            />
          </div>
          <div className="w-full  flex justify-between items-center mb-2 gap-2">
            <label htmlFor="public-date " className="text-[#7a7a7a]">
              End date
            </label>
            <input
              type="date"
              id="public-date"
              placeholder="Date"
              value={searchParams.end}
              className="input input-bordered w-full max-w-xs"
              onChange={(e) =>
                setSearchParams({
                  ...searchParams,
                  end: e.target.value,
                })
              }
            />
          </div>

          <div className="w-full  flex justify-between items-center gap-2 ">
            <label htmlFor="reason" className="text-[#7a7a7a]">
              Reason
            </label>
            <input
              type="text"
              id="reason"
              placeholder="Reason"
              value={searchParams.reason}
              className="input input-bordered w-full max-w-xs"
              onChange={(e) =>
                setSearchParams({
                  ...searchParams,
                  reason: e.target.value,
                })
              }
            />
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={handlePublicLeave}>
                Mark holiday
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};
