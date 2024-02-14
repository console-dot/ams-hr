import { BASE_URL } from "./config";

export const getAllEmployees = async () => {
  const url = `${BASE_URL}/employee`;
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: localStorage.getItem("@token"),
    },
  })
    .then((res) => res?.json())
    .catch((err) => err);
};

export const createEmployee = async (data) => {
  const url = `${BASE_URL}/employee`;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("@token"),
    },
    body: data,
  })
    .then((res) => res?.json())
    .catch((err) => err);
};
export const updateEmployee = async (id, data) => {
  const url = `${BASE_URL}/employee/${id}`;
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("@token"),
    },
    body: data,
  })
    .then((res) => res?.json())
    .catch((err) => err);
};
export const getDesignations = async () => {
  const url = `${BASE_URL}/designation`;
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: localStorage.getItem("@token"),
    },
  })
    .then((res) => res?.json())
    .catch((err) => err);
};
export const getSingleEmployee = async (id) => {
  const url = `${BASE_URL}/employee/${id}`;
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: localStorage.getItem("@token"),
    },
  })
    .then((res) => res?.json())
    .catch((err) => err);
};
