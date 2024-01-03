export const login = (data) => {
  return fetch("http://localhost:5000/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
      return err;
    });
};
