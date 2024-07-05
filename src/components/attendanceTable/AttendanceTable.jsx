import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import { BreadCurmbs, Status } from "../genralComponents";
import { useNavigate } from "react-router-dom";
import { getAllAttendace } from "../../api/attendance";
import { useToastState } from "../../context";
import { ImCross } from "react-icons/im";
import { FaPen } from "react-icons/fa6";

Modal.setAppElement("#root");

const EditModal = ({ isOpen, onClose, onUpdate, attendance }) => {
  const [data, setData] = useState(attendance);

  // useEffect(() => {
  //   setData(attendance);
  // }, [attendance]);
  // const handleUpdate = () => {
  //   onUpdate(data);
  //   onClose();
  // };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
        },
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start">
          <div className="text-lg font-bold ">Edit</div>
          <div className="flex gap-2">
            <div className="text-sm font-semibold">
              {" "}
              {data?.employeeId?.name}
            </div>
            <div className="text-sm font-normal">
              (ID: {data?.employeeId?.employeeId})
            </div>
          </div>
        </div>
        <hr className=" bg-black" />
        <div className="flex flex-col justify-center gap-4">
          <div className="flex flex-col ">
            <label htmlFor="checkin">Checkin</label>
            <input
              name="checkin"
              type="datetime-local"
              value={data?.checkin?.split("Z")[0].replace("T", " ")}
              onChange={(e) => setData(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="checkout">Checkout</label>
            <input
              name="checkout"
              type="datetime-local"
              value={data?.checkout?.split("Z")[0].replace("T", " ")}
              onChange={(e) => setData(e.target.value)}
            />
          </div>
          <div className="flex justify-around items-center">
            <div>
              <button
                className="btn btn-success hover:scale-110"
                // onClick={handleUpdate}
              >
                Update
              </button>
            </div>
            <div>
              <button
                className="btn btn-error hover:scale-110"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export const convertDateWithoutTime = (value, format = "full") => {
  const dateObj = new Date(value);
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return "--";
  }

  let options;

  if (format === "full") {
    options = {
      weekday: "long",
      month: "short",
      day: "numeric",
    };
  } else if (format === "monthAndDay") {
    options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
  } else if (format === "dayAndMonth") {
    options = {
      month: "short",
      day: "numeric",
    };
  } else {
    return "Invalid Format";
  }

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    ...options,
    timeZone: "Asia/Karachi",
  }).format(dateObj);

  return `${formattedDate}`;
};

export const convertDate = (value, format = "full") => {
  const dateObj = new Date(value);
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return "--";
  }

  let options;

  if (format === "full") {
    options = {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
  } else if (format === "monthAndDay") {
    options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
  } else if (format === "time") {
    options = {
      hour: "numeric",
      minute: "numeric",
    };
  } else {
    return "Invalid Format";
  }

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    ...options,
    timeZone: "Asia/Karachi",
  }).format(dateObj);

  return `${formattedDate}`;
};

export const AttendanceTable = ({ data }) => {
  const [attData, setAttData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [dataToChange, setDataToChange] = useState([]);
  const [searchParams, setSearchParams] = useState({
    start: "",
    end: "",
    empId: "",
  });

  const bData = [
    { text: "Home", link: "/dashboard" },
    { text: "Dashboard", link: "/dashboard", status: "active" },
  ];
  const designation = localStorage.getItem("@designation");
  const [modalOpen, setModalOpen] = useState(false);
  const [attendance, setAttendace] = useState({});
  const employeeId = useRef();
  const navigate = useNavigate();
  const { dispatch } = useToastState();
  const filteredData = dataToChange?.filter((obj) =>
    obj?.employeeId?.employeeId
      ?.toString()
      .includes(searchQuery.toLocaleLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const renderPaginationButtons = () => {
    return (
      <div className="join">
        <button
          className="join-item btn btn-outline  w-40 text-slate-100 bg-[#166583]"
          onClick={handlePrevPage}
        >
          Previous page
        </button>
        <button
          className="join-item btn btn-outline w-40 text-slate-100 bg-[#166583]"
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
      const data = attData?.reduce((acc, curr) => {
        if (searchParams?.empId !== null && searchParams?.empId !== "") {
          if (
            curr?.employeeId?.employeeId === searchParams?.empId &&
            curr?.checkout !== null
          ) {
            const s = new Date(searchParams?.start).getTime();
            const e = new Date(searchParams?.end).getTime();
            const c = new Date(curr?.checkin).getTime();
            if (c >= s && c <= e) {
              acc.push(curr);
            }
          }
          return acc;
        }

        const s = new Date(searchParams?.start).getTime();
        const e = new Date(searchParams?.end).getTime();
        const c = new Date(curr?.checkin).getTime();
        if (c >= s && c <= e) {
          acc.push(curr);
        }

        return acc;
      }, []);
      if (data?.length > 0) {
        setDataToChange(data);
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: "ERROR", payload: "Provide valid search params" });
      return;
    }
  };
  const getAttendances = async () => {
    try {
      const res = await getAllAttendace();
      if (res.status === 200) {
        setAttData(res?.data);
        setDataToChange(res?.data);
        dispatch({
          type: "SUCCESS",
          payload: "Attendances Fetched Successfully",
        });
      } else {
        dispatch({ type: "ERROR", payload: res?.message });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAttendances();
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

  const openModal = (data) => {
    setAttendace(data);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
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
            placeholder="Starting Date"
            className="input input-ligt input-dark input-bordered w-full "
            onChange={(e) =>
              setSearchParams({ ...searchParams, start: e.target.value })
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
              setSearchParams({ ...searchParams, end: e.target.value })
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
              setSearchParams({ ...searchParams, empId: e.target.value })
            }
          />
        </div>
        <div className="w-full flex justify-between items-center">
          <button
            className="btn border border-gray-400 mr-2"
            onClick={() => searchCall()}
          >
            Search
          </button>
          {!searchParams?.empId && (
            <button
              className="btn bg-[#186080] text-slate-100 "
              onClick={() =>
                document.getElementById("report-modal").showModal()
              }
            >
              Genrate Report
            </button>
          )}
          {searchParams?.empId && (
            <button
              className="btn"
              onClick={() => {
                const nDate = new Date(searchParams?.end);
                if (nDate <= Date.now()) {
                  navigate(
                    `/report/?empId=${searchParams?.empId}&start=${searchParams.start}&end=${searchParams.end}`
                  );
                }
                dispatch({
                  type: "ERROR",
                  payload: "End Date should be less or equall to today's date",
                });
              }}
            >
              Genrate Report
            </button>
          )}
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
        <table className="table table-zebra-zebra table-lg mb-2">
          <thead>
            <tr>
              <th className="px-3">Employee ID</th>
              <th>Employee Name</th>
              <th>Designation</th>
              <th>CheckIn Time</th>
              <th>CheckOut Time</th>
              <th>Status</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData?.map((obj) => (
              <tr key={obj._id}>
                <th className="px-2">{obj?.employeeId?.employeeId}</th>
                <td className="px-2">{obj?.employeeId?.name}</td>
                <td className="px-2">{obj?.employeeId?.designation?.title}</td>
                <td className="px-2">
                  <div className="flex flex-col gap-0 ">
                    <div> {convertDate(obj?.checkin)}</div>
                    <div className="flex  ">
                      <Status checkin={obj?.checkin} checkout={obj?.checkout} />
                    </div>
                  </div>
                </td>
                <td className="px-2">
                  <div className="flex gap-2 items-center">
                    {convertDate(obj?.checkout)}
                  </div>
                </td>
                <td className="capitalize px-2">
                  {obj?.status ? obj?.status + " " + `day` : "On going"}
                </td>
                <td className="px-2">
                  <div className="flex gap-2 items-center">
                    {designation === "Director HR" && (
                      <button
                        className="px-2 py-2 text-green-600 text-sm hover:bg-green-400 hover:text-white hover:rounded-2xl"
                        onClick={() => openModal(obj)}
                      >
                        <FaPen />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <EditModal
          isOpen={modalOpen}
          onClose={closeModal}
          attendance={attendance}
        />
      </div>
      <div className="w-full flex justify-end items-end">
        {renderPaginationButtons()}
      </div>
      <dialog id="report-modal" className="modal ">
        <div className="modal-box ">
          <div className="modal-action  m-0 p-0 mb-2">
            <form method="dialog">
              <ImCross
                onClick={() => document.getElementById("report-modal").close()}
                className="cursor-pointer"
              />
            </form>
          </div>
          <div className="w-full  flex justify-between items-center mb-2 gap-2">
            <label htmlFor="start-date text-[#7a7a7a]">From</label>
            <input
              type="date"
              id="start-date"
              placeholder="Starting Date"
              className="input input-ligt input-dark input-bordered w-full max-w-xs"
              onChange={(e) =>
                setSearchParams({ ...searchParams, start: e.target.value })
              }
            />
          </div>
          <div className="w-full  flex justify-between items-center mb-2 gap-2">
            <label htmlFor="end-date  text-[#7a7a7a]">To</label>
            <input
              type="date"
              id="end-date"
              placeholder="Ending Date (optional)"
              className="input input-ligt input-dark input-bordered w-full max-w-xs"
              onChange={(e) =>
                setSearchParams({ ...searchParams, end: e.target.value })
              }
            />
          </div>
          <div className="w-full  flex justify-between items-center gap-2 ">
            <label htmlFor="eId">Employee ID</label>
            <input
              type="text"
              id="eId"
              placeholder="ID"
              className="input input-ligt input-dark input-bordered w-full max-w-xs"
              onChange={(e) =>
                setSearchParams({ ...searchParams, empId: e.target.value })
              }
            />
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn"
                onClick={() => {
                  const nDate = new Date(searchParams?.end);
                  if (nDate <= Date.now()) {
                    navigate(
                      `/report/?empId=${searchParams?.empId}&start=${searchParams.start}&end=${searchParams.end}`
                    );
                  }
                  dispatch({
                    type: "ERROR",
                    payload:
                      "End Date should be less or equall to today's date",
                  });
                }}
              >
                Genrate
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};
