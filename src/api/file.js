import { BASE_URL, Login_URL } from "./config";

export const uploadFile = async (body) => {
  console.log(body);
  const formData = new FormData();
  const blob = await fetch(body)
    .then((res) => res.blob())
    .catch((err) => {
      console.error("Error fetching image:", err);
      return null;
    });

  if (!blob) {
    console.error("Failed to convert base64 to Blob.");
    return;
  }
  console.log("first", blob);
  
  // Append the Blob object to FormData with a filename
  formData.append("avatar", blob, "avatar.jpg");
  console.log(formData);

  const url = `${Login_URL}/file`;
  return fetch(url, {
    method: "POST",
    body: formData, // Set formData as the body
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
