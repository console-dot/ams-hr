import React, { useEffect, useState } from "react";
import {
  createDepartment,
  createEmployee,
  getDepartments,
  getDesignations,
  getFileUrl,
  getSingleEmployee,
  updateEmployee,
  uploadFile,
} from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import { useToastState } from "../../context";
import { convertDate } from "../attendanceTable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { AiOutlineCalendar } from "react-icons/ai"; // Calendar icon

export const SignupForm = ({ file, setEmpData, empData }) => {
  const [desi, setDesi] = useState([]);
  const [depa, setDepa] = useState([]);
  const [id, setId] = useState("");
  const [employeeData, setEmployeeData] = useState("");
  const [joiningDate, setJoiningDate] = useState(
    empData?.joiningDate ? new Date(empData.joiningDate) : null
  );
  const [endingDate, setEndingDate] = useState(
    empData?.endingDate ? new Date(empData.endingDate) : null
  );
  const params = useParams();
  const { dispatch } = useToastState();
  const navigate = useNavigate();

  const submitForm = async () => {
    try {
      const formData = new FormData();
      const upload = await uploadFile(file);
      console.log(upload?.avatar, "upload?.avatar");
      formData.append("avatar", empData.avatar);

      if (upload.status === 200) {
        dispatch({
          type: "SUCCESS",
          payload: upload?.message,
        });
      }
      if (id && id !== "") {
        const res = await updateEmployee(
          id,
          JSON.stringify({
            ...empData,
            avatar: upload?.data,
            joiningDate,
            endingDate,
          })
        );
        if (res.status === 200) {
          dispatch({
            type: "SUCCESS",
            payload: res?.message,
          });
          navigate("/employees");
        } else {
          dispatch({
            type: "ERROR",
            payload: res?.message,
          });
        }
      } else {
        const res = await createEmployee(
          JSON.stringify({
            ...empData,
            avatar: upload?.data,
            joiningDate,
            endingDate,
          })
        );
        if (res.status === 201) {
          dispatch({
            type: "SUCCESS",
            payload: res?.message,
          });
          navigate("/employees");
        } else {
          dispatch({
            type: "ERROR",
            payload: res?.message,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllDesignations = async () => {
    try {
      const res = await getDesignations();
      if (res.status === 200) {
        setDesi(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllDepartments = async () => {
    try {
      const res = await getDepartments();
      if (res.status === 200) {
        setDepa(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getEmpData = async () => {
    try {
      const res = await getSingleEmployee(id);
      if (res.status === 200) {
        console.log(res?.data, "DATA");
        setEmployeeData(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllDesignations();
  }, []);

  useEffect(() => {
    getAllDepartments();
  }, []);

  useEffect(() => {
    if (id && id !== "") {
      getEmpData();
    }
  }, [id]);

  useEffect(() => {
    setId(params?.id);
  }, [params]);

  useEffect(() => {
    if (employeeData) {
      setEmpData(employeeData);
      setJoiningDate(
        employeeData.joiningDate ? new Date(employeeData.joiningDate) : null
      );
      setEndingDate(
        employeeData.endingDate ? new Date(employeeData.endingDate) : null
      );
    }
  }, [employeeData, setEmpData]);

  const handleDateChange = (date, dateType) => {
    setEmpData({
      ...empData,
      [dateType]: date ? format(date, "yyyy-MM-dd") : "",
    });
    dateType === "joiningDate" ? setJoiningDate(date) : setEndingDate(date);
  };

  return (
    <div className="flex flex-col p-4">
      <form>
        {/* First row with Name and Designation */}
        <div className="flex space-x-4">
          {/* Name */}
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text text-[#9a9a9a]">Name</span>
            </div>
            <input
              onChange={(e) => setEmpData({ ...empData, name: e.target.value })}
              value={empData?.name}
              required
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              name="name"
              id="name"
            />
          </label>

          {/* Designation */}
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text text-[#9a9a9a]">Designation</span>
            </div>
            <select
              onChange={(e) =>
                setEmpData({ ...empData, designation: e.target.value })
              }
              value={empData?.designation?.title}
              required
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              name="designation"
              id="designation"
            >
              <option default>
                {empData?.designation?.title
                  ? empData?.designation?.title
                  : "Select Designation"}
              </option>
              {desi?.map((obj) => (
                <option key={obj?._id} value={obj?._id}>
                  {obj?.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        {!id && (
          <div className="flex space-x-4">
            {/* Password */}
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text text-[#9a9a9a]">Password</span>
              </div>
              <input
                onChange={(e) =>
                  setEmpData({ ...empData, password1: e.target.value })
                }
                value={empData?.password1}
                required
                type="password"
                placeholder="*****"
                className="input input-bordered w-full max-w-xs"
              />
            </label>

            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text text-[#9a9a9a]">
                  Confirm Password
                </span>
              </div>
              <input
                onChange={(e) =>
                  setEmpData({ ...empData, password2: e.target.value })
                }
                value={empData?.password2}
                required
                type="password"
                placeholder="*****"
                className="input input-bordered w-full max-w-xs"
              />
            </label>
          </div>
        )}

        <div className="flex space-x-4">
          {/* email */}
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text text-[#9a9a9a]">Email</span>
            </div>
            <input
              onChange={(e) =>
                setEmpData({ ...empData, email: e.target.value })
              }
              value={empData?.email}
              required
              type="email"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              name="email"
              id="email"
            />
          </label>

          {/* phone */}
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text text-[#9a9a9a]">Phone</span>
            </div>
            <input
              onChange={(e) =>
                setEmpData({ ...empData, phone: e.target.value })
              }
              value={empData?.phone}
              required
              type="tel"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              name="phone"
              id="phone"
            />
          </label>
        </div>

        {/* Second row with Team and Department */}
        <div className="flex space-x-4 mb-4">
          {/* Department */}
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text text-[#9a9a9a]">Department</span>
            </div>
            <select
              onChange={(e) =>
                setEmpData({ ...empData, department: e.target.value })
              }
              value={empData?.department}
              required
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              name="department"
              id="department"
            >
              <option default>
                {empData?.designation?.department?.title
                  ? empData?.designation?.department?.title
                  : "Select Dept."}
              </option>
              {depa?.map((obj) => (
                <option key={obj?._id} value={obj?._id}>
                  {obj?.title}
                </option>
              ))}
            </select>
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text text-[#9a9a9a]">Employee Id</span>
            </div>
            <input
              onChange={(e) =>
                setEmpData({ ...empData, employeeId: e.target.value })
              }
              value={empData?.employeeId}
              required
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              id="employeeId"
              name="employeeId"
            />
          </label>
        </div>

        {/* Qualification section */}
        <div className="flex justify-start items-start flex-col flex-wrap space-y-4 w-full mb-4">
          <h2 className="text-lg font-bold mb-2">Qualification</h2>
          <div className="flex space-x-4 w-full">
            {/* Education */}
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text text-[#9a9a9a]">Education</span>
              </div>
              <input
                onChange={(e) =>
                  setEmpData({ ...empData, education: e.target.value })
                }
                value={empData?.education}
                required
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full max-w-xs"
                id="education"
                name="education"
              />
            </label>

            {/* Experience */}
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text text-[#9a9a9a]">Experience</span>
              </div>
              <input
                onChange={(e) =>
                  setEmpData({ ...empData, experience: e.target.value })
                }
                value={empData?.experience}
                required
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full max-w-xs"
                name="experience"
                id="experience"
              />
            </label>
          </div>
          {/* Joining Date */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full">
            {/* Joining Date */}
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text text-[#9a9a9a]">Joining Date</span>
              </div>
              <div className="relative flex items-center">
                <AiOutlineCalendar className="absolute left-0 ml-3 text-gray-500 z-[2]" />
                <DatePicker
                  selected={joiningDate}
                  onChange={(date) => handleDateChange(date, "joiningDate")}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select Joining Date"
                  className="input input-bordered w-full pl-10 max-w-xs z-[1]"
                  id="joiningDate"
                  name="joiningDate"
                />
              </div>
            </label>

            {/* Ending Date */}
            {id && (
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text text-[#9a9a9a]">Ending Date</span>
                </div>
                <div className="relative flex items-center">
                  <AiOutlineCalendar className="absolute left-0 ml-3 text-gray-500 z-[2]" />
                  <DatePicker
                    selected={endingDate}
                    onChange={(date) => handleDateChange(date, "endingDate")}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select Ending Date"
                    className="input input-bordered w-full pl-10 max-w-xs z-[1]"
                    id="endingDate"
                    name="endingDate"
                  />
                </div>
              </label>
            )}
          </div>
        </div>
      </form>
      {/* Submit button */}
      <button className="btn btn-primary" onClick={submitForm}>
        Submit
      </button>
    </div>
  );
};
