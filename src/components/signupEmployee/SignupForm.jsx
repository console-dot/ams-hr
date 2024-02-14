import React, { useEffect, useState } from "react";
import {
  createEmployee,
  getDesignations,
  getFileUrl,
  getSingleEmployee,
  updateEmployee,
  uploadFile,
} from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import { useToastState } from "../../context";

export const SignupForm = ({ setEmpData, empData }) => {
  const [desi, setDesi] = useState([]);
  const [id, setId] = useState("");
  const [employeeData, setEmployeeData] = useState("");
  const params = useParams();
  const { dispatch } = useToastState();
  const navigate = useNavigate();

  const submitForm = async () => {
    try {
      const formData = new FormData();
      formData.append("avatar", empData.avatar);
      const upload = await uploadFile(formData);
      if (upload.status === 200) {
        dispatch({
          type: "SUCCESS",
          payload: upload?.message,
        });
      }
      if (id && id !== "") {
        const res = await updateEmployee(
          id,
          JSON.stringify({ ...empData, avatar: upload?.data })
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
          JSON.stringify({ ...empData, avatar: upload?.data })
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
  const getEmpData = async () => {
    try {
      const res = await getSingleEmployee(id);
      if (res.status === 200) {
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
    }
  }, [employeeData, setEmpData]);
  return (
    <div className="flex flex-col  p-4 ">
      <form>
        {/* First row with Name and Designation */}
        <div className="flex space-x-4 ">
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
              value={empData?.designation}
              required
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              name="designation"
              id="designation"
            >
              {desi?.map((obj) => (
                <option value={obj?._id}>{obj?.title}</option>
              ))}
            </select>
          </label>
        </div>
        {!id && (
          <div className="flex space-x-4 ">
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
        <div className="flex space-x-4 ">
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
          {/* Team */}
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text text-[#9a9a9a]">Team</span>
            </div>
            <input
              onChange={(e) => setEmpData({ ...empData, team: e.target.value })}
              value={empData?.team}
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              id="team"
              name="team"
            />
          </label>

          {/* Department */}
          <label className="form-control w-full max-w-xs">
            <div className="label ">
              <span className="label-text text-[#9a9a9a] ">Department</span>
            </div>
            <input
              onChange={(e) =>
                setEmpData({ ...empData, department: e.target.value })
              }
              value={empData?.department}
              required
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              id="department"
              name="department"
            />
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
          <div className="flex space-x-4 w-full">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text text-[#9a9a9a]">Joining Date</span>
              </div>
              <input
                onChange={(e) =>
                  setEmpData({ ...empData, joiningDate: e.target.value })
                }
                value={empData?.joiningDate}
                required
                type="date"
                placeholder="Type here"
                className="input input-bordered w-full max-w-xs"
                id="joiningDate"
                name="joiningDate"
              />
            </label>

            {/* Ending Date */}
            {id && (
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text text-[#9a9a9a]">Ending Date</span>
                </div>
                <input
                  onChange={(e) =>
                    setEmpData({ ...empData, endingDate: e.target.value })
                  }
                  value={empData?.endingDate}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs"
                  id="endingDate"
                  name="endingDate"
                />
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
