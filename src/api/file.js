import { BASE_URL, Login_URL } from "./config"

export const uploadFile = async (body) => {
  const url = `${BASE_URL}/file`;
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: localStorage.getItem("@token"),
    },
    body,
  })
    .then((res) => res?.json())
    .catch((err) => err);
};
export const getFileUrl = async (id) => {
  const url = `${Login_URL}/file/${id}`;
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: localStorage.getItem("@token"),
    },
  });
};
