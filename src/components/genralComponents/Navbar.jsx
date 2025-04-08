import { Link, useNavigate } from "react-router-dom";

import { Toast } from "./Toast";
import { useEffect, useState } from "react";
export const Navbar = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 768px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(min-width: 768px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

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
              <li>
                <Link to={"/public-holidays"}>Public holiday</Link>
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
   
      <Toast />
    </div>
  );
};
