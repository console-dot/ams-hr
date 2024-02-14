import { GenralLayout } from "../themes";
import { CiCamera } from "react-icons/ci";
import { BreadCurmbs, SignupForm } from "../components";
import { useParams } from "react-router-dom";
import { getFileUrl } from "../api";
import { useToastState } from "../context";
import { useEffect, useState } from "react";
export const RegisterEmployee = () => {
  const [fileInput, setFileInput] = useState(null);
  const [imgSrc, setImgSrc] = useState("/logo.jpg");
  const [empData, setEmpData] = useState({
    name: "",
    employeeId: "",
    designation: "",
    password1: "",
    password2: "",
    email: "",
    phone: "",
    team: "",
    department: "",
    education: "",
    experience: "",
    joiningDate: "",
    endingDate: "",
    avatar: "",
  });
  const params = useParams();
  const { dispatch } = useToastState();

  const handleFileClick = () => {
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEmpData({
        ...empData,
        avatar: e.target.files[0],
      });
      const url = URL.createObjectURL(e.target.files[0]);
      setImgSrc(url);
    } else {
      console.error("No file selected");
    }
  };

  const getEmpAvatar = async () => {
    try {
      const id = empData?.avatar;
      const res = await getFileUrl(id);
      if (res.status === 200) {
        setImgSrc(res?.url);
        dispatch({ type: "SUCCESS", payload: "Image fetched Successfully" });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (
      empData?.avatar !== "" ||
      empData?.avatar !== undefined ||
      empData?.avatar !== null
    ) {
      getEmpAvatar();
    }
  }, [empData]);

  const bData = [
    { text: "Home", link: "/" },
    { text: "Dashboard", link: "/dashboard " },
    { text: "Employees", link: "/employees" },
    {
      text: params?.id ? "Update Employee" : "Register Employee",
      link: "/register",
      status: "active",
    },
  ];

  return (
    <GenralLayout>
      <BreadCurmbs data={bData} />
      <div className=" w-full p-4 h-auto flex justify-start items-center flex-col ">
        <div className="flex  justify-start items-start w-full">
          <h2 className="font-bold text-lg px-4 text-start">
            {params?.id ? "Edit employee details" : "Add employee"}
          </h2>
        </div>
        <div className="text-center shadow-lg max-w-5xl card bg-base-200">
          <div className="card-body">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div class="col-span-1 md:col-span-2 lg:col-span-2 flex items-center flex-col justify-center">
                <div className="p-4 gap-2 w-full">
                  <div className="card w-full p-2 h-full  border shadow-md flex justify-center items-center ">
                    <div className="avatar relative">
                      <div className="rounded-lg">
                        <img id="previewImage" src={imgSrc} alt="Preview" />
                        <div
                          className="btn p-0 m-0 z-10 avatar text-2xl absolute top-[86%] right-0 bg-slate-100 flex justify-center items-center rounded-full w-11 h-11"
                          onClick={handleFileClick}
                        >
                          <CiCamera />
                          <input
                            required
                            type="file"
                            className="hidden"
                            ref={(input) => setFileInput(input)}
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-span-1 md:col-span-2 lg:col-span-3">
                <SignupForm empData={empData} setEmpData={setEmpData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </GenralLayout>
  );
};
