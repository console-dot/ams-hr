import { Link } from "react-router-dom";

export const BreadCurmbs = ({ data }) => {
  // console.log(data,"check")
  return (
    <div className="text-sm breadcrumbs w-full px-5">
      <ul>
        {data?.map((obj, index) => (
          <li key={index}>
            <Link
              key={index}
              to={obj?.link}
              className={` ${
                obj?.status === "active" ? "text-blue-600" : "text-[#9a9a9a]"
              }`}
            >
              {obj?.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
