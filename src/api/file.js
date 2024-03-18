import { BASE_URL, Login_URL } from "./config"

export const uploadFile = async (body) => {
  const formData = new FormData()
  formData.append("avatar", body)
  console.log(formData,'www')
  const url = `${Login_URL}/file`;
  return fetch(url, {
    method: "POST",
    formData,
    headers: {
      Authorization: localStorage.getItem("@token"),
    },
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
