
export const uploadFile = async (body) => {
  const url = "http://localhost:5000/api/v1/file";
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
  console.log(id)
  const url = `http://localhost:5000/api/v1/file/${id}`;
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: localStorage.getItem("@token"),
    },
  });
};
