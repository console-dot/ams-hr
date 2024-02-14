import { useEffect, useState } from "react";
import { GenralLayout } from "../../themes";
import { genReport, getLeaves } from "../../api/attendance";
import { useToastState } from "../../context";
import { GenralReport } from "./GenralReport";
import { LeavesDetail } from "./LeavesDetail";
import { AbsentsDetail } from "./AbsentsDetail";
import { HolidayDetails } from "./HolidayDetails";

export const EmployeeReport = () => {
  const [empData, setEmpData] = useState([]);
  const [leaves, setLeaves] = useState();
  const [holiday, setHoliday] = useState([]);
  const [width, setWidth] = useState("200px");
  const [me, setMe] = useState(null);
  const [activeTab, setActivetab] = useState("report");
  const [active, setActive] = useState("report");
  const p = new URLSearchParams(window.location.search);
  const { dispatch } = useToastState();
  const empId = p.get("empId");
  const start = p.get("start");
  const end = p.get("end");
  const searchParams = {
    start: start,
    end: end,
    empId: empId,
  };
  const returnDaysReport = (active) => {
    return empData.attendance?.filter((obj) => obj?.status === active).length;
  };
  const genrateReport = async () => {
    try {
      const res = await genReport(searchParams);
      if (res.status === 200) {
        setEmpData(res?.data);
        setHoliday(res?.data?.publicHolidays);
        setMe(res?.data?.user);
        dispatch({ type: "SUCCESS", payload: res?.message });
      } else {
        dispatch({ type: "ERROR", payload: res?.message });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllLeaves = async () => {
    try {
      const res = await getLeaves(me?._id, searchParams);
      if (res.status === 200) {
        setLeaves(res?.data);
        dispatch({ type: "SUCCESS", payload: res?.message });
      } else {
        dispatch({ type: "ERROR", payload: res?.message });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getDepartment = (dep) => {
    switch (dep) {
      case "dev":
        return "Development";
      case "bd":
        return "Bidder";
      case "hr":
        return "Human Resource";
      default:
        return "Invalid Department";
    }
  };
  const handleSideNav = () => {
    if (width !== "0px") {
      setWidth("0px");
    } else setWidth("600px");
  };
  useEffect(() => {
    genrateReport();
  }, []);
  const [test, setTest] = useState(false);
  useEffect(() => {
    const fn = async () => {
      if (!test) {
        setTest((p) => !p);
        await fetchAllLeaves();
      }
    };
    if (me && me?._id) {
      fn();
    }
  }, [me]);

  return (
    <div className="overflow-x-auto p-4 relative">
      <div className="flex w-full justify-start items-center p-2 gap-2">
        <div className="flex w-full justify-start items-center p-2 gap-2">
          <p className="font-bold">Name:</p> <span>{me?.name}</span>
        </div>
        <div className="flex w-full justify-start items-center p-2 gap-2">
          <p className="font-bold">Employee Id:</p>
          <span>{me?.employeeId}</span>
        </div>
        <div className="flex w-full justify-start items-center p-2 gap-2">
          <p className="font-bold">Department:</p>
          <span>{getDepartment(me?.employeeId?.split("-")[1])}</span>
        </div>
      </div>

      <div className="w-full flex justify-between p-2 items-center gap-4 ">
        <div
          onClick={() => {
            setActivetab("report");
            setActive("report");
          }}
          className={`border w-full border-b-0 cursor-pointer gap-4 p-2 rounded-md rounded-br-none flex justify-center items-center rounded-bl-none ${
            active === "report"
              ? "bg-white"
              : "bg-gray-300 hover:bg-[#166583] hover:text-slate-50"
          }`}
        >
          Report
          <div className="badge border-[#166583] badge-outline hover:bg-slate-50 hover:text-black badge-lg">
            {empData?.attendance?.length}
          </div>
        </div>
        <div
          onClick={() => {
            setActivetab("leaves");
            setActive("leaves");
          }}
          className={`border w-full border-b-0 cursor-pointer gap-4 p-2 rounded-md rounded-br-none flex justify-center items-center rounded-bl-none ${
            active === "leaves"
              ? "bg-white"
              : "bg-gray-300 hover:bg-[#166583] hover:text-slate-50"
          }`}
        >
          Leaves
          <div className="badge border-[#166583] badge-outline hover:bg-slate-50 hover:text-black badge-lg">
            {empData?.leaves?.length}
          </div>
        </div>
        <div
          onClick={() => {
            {
              setActivetab("absents");
              setActive("absents");
            }
          }}
          className={`border w-full border-b-0 cursor-pointer gap-4 p-2 rounded-md rounded-br-none flex justify-center items-center rounded-bl-none ${
            activeTab === "absents"
              ? "bg-white"
              : "bg-gray-300 hover:bg-[#166583] hover:text-slate-50"
          }`}
        >
          Absents
          <div className="badge border-[#166583] badge-outline hover:bg-slate-50 hover:text-black badge-lg">
            {empData?.abDates?.length}
          </div>
        </div>
        <div
          onClick={() => {
            setActivetab("report");
            setActive("full");
          }}
          className={`border w-full border-b-0 cursor-pointer gap-4 p-2 rounded-md rounded-br-none flex justify-center items-center rounded-bl-none ${
            active === "full"
              ? "bg-white"
              : "bg-gray-300 hover:bg-[#166583] hover:text-slate-50"
          }`}
        >
          Full day
          <div className="badge border-[#166583] badge-outline hover:bg-slate-50 hover:text-black badge-lg">
            {returnDaysReport("full")}
          </div>
        </div>
        <div
          onClick={() => {
            setActivetab("report");
            setActive("half");
          }}
          className={`border w-full border-b-0 cursor-pointer gap-4 p-2 rounded-md rounded-br-none flex justify-center items-center rounded-bl-none ${
            active === "half"
              ? "bg-white"
              : "bg-gray-300 hover:bg-[#166583] hover:text-slate-50"
          }`}
        >
          Half day
          <div className="badge border-[#166583] badge-outline hover:bg-slate-50 hover:text-black badge-lg">
            {returnDaysReport("half")}
          </div>
        </div>
        <div
          onClick={() => {
            setActivetab("holiday");
            setActive("holiday");
          }}
          className={`border w-full border-b-0 cursor-pointer gap-4 p-2 rounded-md rounded-br-none flex justify-center items-center rounded-bl-none ${
            active === "holiday"
              ? "bg-white"
              : "bg-gray-300 hover:bg-[#166583] hover:text-slate-50"
          }`}
        >
          Public holidays
          <div className="badge border-[#166583] badge-outline hover:bg-slate-50 hover:text-black badge-lg">
            {holiday?.length}
          </div>
        </div>
      </div>

      {activeTab === "report" && (
        <GenralReport data={empData?.attendance} active={active} />
      )}
      {activeTab === "leaves" && <LeavesDetail leaves={empData?.leaves} />}
      {activeTab === "absents" && <AbsentsDetail absents={empData?.abDates} />}
      {activeTab === "holiday" && <HolidayDetails holiday={holiday} />}
    </div>
  );
};
