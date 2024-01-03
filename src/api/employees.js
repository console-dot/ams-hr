
export const getAllEmployees = async () => {
  const url = "http://localhost:5000/api/v1/employee";
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
  const url = "http://localhost:5000/api/v1/employee";
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
  const url = `http://localhost:5000/api/v1/employee/${id}`;
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
  const url = "http://localhost:5000/api/v1/designation";
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
  const url = `http://localhost:5000/api/v1/employee/${id}`;
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: localStorage.getItem("@token"),
    },
  })
    .then((res) => res?.json())
    .catch((err) => err);
};
