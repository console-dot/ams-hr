import { useEffect, useRef, useState } from "react";
import { BreadCurmbs } from "../genralComponents";
import { Link, useNavigate } from "react-router-dom";
import { getAllEmployees } from "../../api";
import { useToastState } from "../../context";
import { GenralLayout } from "../../themes";
import { FaPlus } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";

export const EmployeesTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [searchQuery, setSearchQuery] = useState("");
  const [dataToChange, setDataToChange] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const employeeId = useRef();
  const navigate = useNavigate();
  const { dispatch } = useToastState();

  const EditEmployee = () => {
    return (
      <>
        <button className="btn p-4">
          <CiEdit className="text-2xl" />
        </button>
      </>
    );
  };
  
  const filteredData = dataToChange?.filter((obj) => {
    return obj?.employeeId
      ?.toString()
      .includes(searchQuery.toLocaleLowerCase());
  });
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
          className="join-item btn btn-outline w-40 bg-['#166583']"
          onClick={handlePrevPage}
        >
          Previous page
        </button>
        <button
          className="join-item btn btn-outline w-40 bg-['#166583']"
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
  
    // Filter the original data based on the search query
    const filteredOriginalData = originalData?.filter((obj) => {
      return obj?.employeeId
        ?.toString()
        .includes(searchQuery.toLocaleLowerCase());
    });
  
    // Update the dataToChange state with the filtered data
    setDataToChange(filteredOriginalData);
  };

  const getEmployees = async () => {
    try {
      const res = await getAllEmployees();
      if (res.status === 200) {
        setOriginalData(res?.data); // Store the original data
        setDataToChange(res?.data);
        dispatch({
          type: "SUCCESS",
          payload: "Employees Fetched Successfully",
        });
      } else {
        dispatch({ type: "ERROR", payload: res?.message });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleEdit = (employeeId) => {
    navigate(`edit/${employeeId}`);
  };

  useEffect(() => {
    getEmployees();
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
    { text: "Employees", link: "/", status: "active" },
  ];
  return (
    <GenralLayout>
      <div className=" p-4">
        <div className="w-full mb-4 ">
          <BreadCurmbs data={bData} />
        </div>

        <div className="w-full flex justify-end items-center px-4 gap-4">
          <input
            type="text"
            id="table-search"
            placeholder="Ctrl+k to search"
            className="max-w-lg border-gray-300 input input-sm underline p-5 focus:no-underline"
            ref={employeeId}
            onChange={handleSearch}
          />
          <Link to={"/register"} className="btn border border-slate-300">
            <FaPlus />
            Add Employee
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full table-lg mb-2">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Email</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData?.map((obj, index) => (
                <tr key={index}>
                  <th className="px-2">{obj?.employeeId}</th>
                  <td className="px-2"> {obj?.name} </td>
                  <td className="px-2">
                    {obj?.designation?.department?.title}
                  </td>
                  <td className="px-2">{obj?.email}</td>
                  <td onClick={() => handleEdit(obj?._id)}>
                    <EditEmployee />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-full flex justify-end items-end px-2">
          {renderPaginationButtons()}
        </div>
      </div>
    </GenralLayout>
  );
};
