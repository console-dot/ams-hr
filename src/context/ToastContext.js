import React, { createContext, useContext, useReducer } from "react";

const ToastStateContext = createContext();

export function useToastState() {
  return useContext(ToastStateContext);
}

const initialState = {
  message: null,
  variant: null,
};

function toastStateReducer(state, action) {
  switch (action.type) {
    case "RESET":
      return {
        ...state,
        message: null,
        variant: null,
      };
    case "SUCCESS":
      return {
        ...state,
        message: action.payload,
        variant: "success",
      };
    case "ERROR":
      return {
        ...state,
        message: action.payload,
        variant: "error",
      };
    case "WARNING":
      return {
        ...state,
        message: action.payload,
        variant: "warning",
      };
    default:
      return state;
  }
}

export function ToastStateProvider({ children }) {
  const [state, dispatch] = useReducer(toastStateReducer, initialState);

  return (
    <ToastStateContext.Provider value={{ state, dispatch }}>
      {children}
    </ToastStateContext.Provider>
  );
}
