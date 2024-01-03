import { Link, useNavigate } from "react-router-dom";
import { markHoliday, markLeave } from "../../api/attendance";
import { useToastState } from "../../context";
import { Toast } from "./Toast";
import { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
export const Navbar = () => {
  const { dispatch } = useToastState();
  const [searchParams, setSearchParams] = useState({
    reason: "",
    start: "",
  });
  const navigate = useNavigate();
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 768px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(min-width: 768px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  const handlePublicLeave = async () => {
    try {
      const res = await markHoliday(searchParams);
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
  return (
    <div className="navbar bg-base-100 p-4 px-6 border border-b-slate-300">
      <div className=" w-full flex justify-between items-center ">
        <div className="flex justify-start items-center flex-col gap-1 ">
          <Link
            to={"/dashboard"}
            className="btn w-12 h-12 p-0 m-0 rounded-lg text-white"
          >
            <img
              src="/logo.jpg"
              className="w-full h-full rounded-lg shadow-xl"
              alt="logo"
            />
          </Link>
          <p className="text-[#166583] font-bold">ConsoleDot</p>
        </div>
        <div className="flex text-2xl text-[#166583] justify-center items-center">
          {!matches ? "AMS" : "Attendance Management System"}
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full ">
                <img alt="Tailwind CSS Navbar component" src="/logo.jpg" />{" "}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 border border-[#e0dede] shadow card-body menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to={"/employees"}>Employees</Link>
              </li>

              <li
                onClick={() =>
                  document.getElementById("public-leave-modal").showModal()
                }
              >
                <p className="link no-underline">Add public holiday</p>
              </li>
              <li>
                <Link to={"/employee-leaves"}>Employee Leaves</Link>
              </li>
              <li
                onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}
              >
                <Link>Logout</Link>
              </li>
            </ul>
          </div>
        </div>
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
              Leave date
            </label>
            <input
              type="date"
              id="public-date"
              placeholder="Date"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) =>
                setSearchParams({
                  ...searchParams,
                  start: e.target.value,
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
      <Toast />
    </div>
  );
};
