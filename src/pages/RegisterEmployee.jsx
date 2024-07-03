import { GenralLayout } from "../themes";
import { CiCamera } from "react-icons/ci";
import { BreadCurmbs, SignupForm } from "../components";
import { useParams } from "react-router-dom";
import { getFileUrl } from "../api";
import { useToastState } from "../context";
import { useEffect, useState } from "react";
import ImageCropper from "./ImageCropper";
import Modal from "react-modal";

export const RegisterEmployee = () => {
  const [fileInput, setFileInput] = useState(null);
  const [file, setFile] = useState(null);
  const [imgSrc, setImgSrc] = useState("/logo.jpg");
  const [croppedImage, setCroppedImage] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
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
    if (e?.target?.files && e?.target?.files[0]) {
      setFile(URL.createObjectURL(e.target.files[0]));
    }
    setModalIsOpen(true);
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

  const handleCropComplete = (croppedImg) => {
    setCroppedImage(croppedImg);
    setEmpData({
      ...empData,
      avatar: croppedImage,
    });
    setModalIsOpen(false);
    handleFileChange();
  };

  useEffect(() => {
    if (params?.id && empData?.avatar) {
      getEmpAvatar();
    }
  }, [empData]);

  useEffect(() => {
    if (croppedImage) {
      setEmpData({
        ...empData,
        avatar: croppedImage,
      });
      setModalIsOpen(false);
      setImgSrc(croppedImage);
    } else {
      console.error("No file selected");
    }
  }, [croppedImage]);

  useEffect(() => {
    console.log(imgSrc, "src");
  }, [imgSrc]);

  const bData = [
    { text: "Home", link: "/dashboard" },
    { text: "Dashboard", link: "/dashboard " },
    { text: "Employees", link: "/employees" },
    {
      text: params?.id ? "Update Employee" : "Register Employee",
      link: "/register",
      status: "active",
    },
  ];

  // console.log(empData);

  return (
    <GenralLayout>
      <BreadCurmbs data={bData} />
      <div className="w-full p-4 h-auto flex justify-start items-center flex-col">
        <div className="flex justify-start items-start w-full">
          <h2 className="font-bold text-lg px-4 text-start">
            {params?.id ? "Edit employee details" : "Add employee"}
          </h2>
        </div>
        <div className="text-center shadow-lg max-w-5xl card bg-base-200">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="col-span-1 md:col-span-2 lg:col-span-2 flex items-center flex-col justify-center">
                <div className="p-4 gap-2 w-full">
                  <div className="card w-full p-2 h-full border shadow-md flex justify-center items-center">
                    <div className="avatar relative">
                      <div className="rounded-lg">
                        <img id="previewImage" src={imgSrc} alt="Preview" />
                        <div
                          className="btn p-0 m-0  avatar text-2xl absolute top-[86%] right-0 bg-slate-100 flex justify-center items-center rounded-full w-11 h-11"
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
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <SignupForm
                  file={croppedImage}
                  empData={empData}
                  setEmpData={setEmpData}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <ImageCropper imageSrc={file} onCropComplete={handleCropComplete} />
        {croppedImage && (
          <div>
            {/* <h2>Cropped Image</h2>
            <img src={croppedImage} alt="Cropped" /> */}
          </div>
        )}
      </Modal>
    </GenralLayout>
  );
};
