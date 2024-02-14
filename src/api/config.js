export const BASE_URL =
  process.env.REACT_APP_NODE_ENV === "local"
    ? "http://localhost:5000/api/v1/hr"
    : "https://ams-api.vercel.app/api/v1/hr";
export const WS_URL =
  process.env.REACT_APP_NODE_ENV === "local"
    ? "http://localhost:5000"
    : "https://ams-api.vercel.app";
    export const Login_URL =
  process.env.REACT_APP_NODE_ENV === "local"
    ? "http://localhost:5000"
    : "https://ams-api.vercel.app/api/v1";
