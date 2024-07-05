import { BASE_URL } from "./config";

export const getAllAttendace = () => {
  return fetch(BASE_URL + "/all-attendances", {
    method: "GET",
    headers: {
      Authorization: localStorage.getItem("@token"),
    },
  })
    .then((res) => res?.json())
    .catch((err) => err);
};

export const updateAttendance = async (
  attendanceId,
  employeeId,
  checkin,
  checkout
) => {
  return fetch(BASE_URL + `/update-attendance/${attendanceId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("@token"),
    },
    body: JSON.stringify({ employeeId, checkin, checkout }),
  }).then((res) => res.json());
};

export const markCheckout = async (attendanceId, date) => {
  return fetch(BASE_URL + "mark-checkout", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("@token"),
    },
    body: JSON.stringify({ attendanceId, date }),
  });
};

export const searchAttendances = async (searchParams) => {
  const url = `${BASE_URL}/search-emp-attendance?start=${searchParams?.start}&end=${searchParams?.end}&empId=${searchParams?.empId}`;
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: localStorage.getItem("@token"),
    },
  })
    .then((res) => res?.json())
    .catch((err) => err);
};

export const genReport = async (searchParams) => {
  const url = `${BASE_URL}/report?start=${searchParams?.start}&end=${searchParams?.end}&empId=${searchParams?.empId}`;
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: localStorage.getItem("@token"),
    },
  })
    .then((res) => res?.json())
    .catch((err) => err);
};

export const markLeave = (data) => {
  return fetch(BASE_URL + "/mark-leave", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("@token"),
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => err);
};

export const getLeaves = (id, searchParams) => {
  const url = `${BASE_URL}/leaves?id=${id}&start=${searchParams?.start}&end=${searchParams?.end}`;
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: ` ${localStorage.getItem("@token")}`,
    },
  })
    .then((res) => res.json())
    .catch((err) => err);
};
export const fetchAllLeaves = () => {
  const url = `${BASE_URL}/all-leaves`;
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: ` ${localStorage.getItem("@token")}`,
    },
  })
    .then((res) => res.json())
    .catch((err) => err);
};

export const markHoliday = (data) => {
  return fetch(BASE_URL + "/mark-holiday", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("@token"),
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => err);
};
