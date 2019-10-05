import axios from "axios";

const authenticationApi = axios.create({
  baseURL: "/auth"
});

export const signUp = ({ email, name, password }) => {
  return new Promise((resolve, reject) => {
    console.log("services", email, password, name);
    authenticationApi
      .post("/signup", { email, name, password })
      .then(response => {
        resolve(response.data.data.user);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const signIn = ({ email, password }) => {
  return new Promise((resolve, reject) => {
    authenticationApi
      .post("/login", { email, password })
      .then(response => {
        resolve(response.data.data.user);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const signOut = () => {
  return new Promise((resolve, reject) => {
    authenticationApi
      .post("/signout")
      .then(response => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const verify = () => {
  return new Promise((resolve, reject) => {
    authenticationApi
      .get("/verify")
      .then(response => {
        resolve(response.data.data.user);
      })
      .catch(error => {
        reject(error);
      });
  });
};
