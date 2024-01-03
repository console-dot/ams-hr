import { io } from "socket.io-client";
import "./App.css";
import { Toast } from "./components";
import { AllRoutes } from "./routes";
import { WS_URL } from "./api/config";
export const socket = io(WS_URL);

function App() {
  return (
    <>
      <AllRoutes />
      <Toast />
    </>
  );
}

export default App;
