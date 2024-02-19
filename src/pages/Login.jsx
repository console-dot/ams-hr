import { Link, useNavigate } from "react-router-dom";
import { login } from "../api";
import { useState } from "react";
import { Spinner } from "flowbite-react";
import { useToastState } from "../context";
import { Toast } from "../components";

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useToastState();
  const handleLogin = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const res = await login({
        username: formData.get("username"),
        password: formData.get("password"),
        module: "hr",
      });
      if (res?.status !== 200) {
        dispatch({ type: "ERROR", payload: res?.message });
        throw new Error(res?.message);
      }
      dispatch({ type: "SUCCESS", payload: res?.message });
      localStorage.setItem("@token", res?.data?.token);
      localStorage.setItem("@user", JSON.stringify(res?.data?.employeeExist));
      localStorage.setItem("@designation", res?.data?.userDesignation);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Toast />
      <section>
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <Link
            to="/login"
            className="flex items-center mb-6 text-2xl font-semibold "
          >
            <img
              className="w-8 h-8 mr-2 rounded-md"
              src="/logo.jpg"
              alt="logo"
            />
            AMS - ConsoleDot
          </Link>
          <div
            className="w-full rounded-lg shadow dark:shadow-lg dark:shadow-white md:mt-0 sm:max-w-md xl:p-0 
          border dark:border-gray-500 "
          >
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold dark:text-white leading-tight tracking-tight md:text-2xl ">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email or ID
                  </label>
                  <input
                    type="text"
                    name="username"
                    disabled={loading}
                    id="email"
                    className=" border sm:text-sm rounded-lg block w-full p-2.5 input-light input-dark"
                    placeholder="email@consoledot.com or AA-AAA-0000"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    disabled={loading}
                    placeholder="••••••••"
                    className=" border sm:text-sm rounded-lg block w-full p-2.5 input-light input-dark"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        name="remember"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="remember"
                        className="text-gray-500 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                  <Link
                    to="/forget-password"
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Forgot password?
                  </Link>
                </div>
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  {loading && (
                    <Spinner aria-label="Filter Attendance" size="sm" />
                  )}
                  <span className={loading ? "pl-3" : null}>Sign in</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
