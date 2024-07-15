export const BASE_URL =
  process.env.REACT_APP_NODE_ENV === "local"
    ? "http://localhost:5000/api/v1/hr"
    : "https://apiv2.ams.consoledot.com/api/v1/hr";
export const WS_URL =
  process.env.REACT_APP_NODE_ENV === "local"
    ? "http://localhost:5000"
    : "https://apiv2.ams.consoledot.com";
    export const Login_URL =
  process.env.REACT_APP_NODE_ENV === "local"
    ? "http://localhost:5000/api/v1"
    : "https://apiv2.ams.consoledot.com/api/v1";
