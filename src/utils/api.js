import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export default {
  getData: (url) =>
    instance({
      method: "GET",
      url: url,
      params: {
        search: "parameter",
      },
    }),
  postData: (url, data) =>
    instance({
      method: "POST",
      url: url,
      data: data,
    }),
  putData: (url, data) =>
    instance({
      method: "Put",
      url: url,
      data: data,
    }),
  deleteData: (url, data) =>
    instance({
      method: "DELETE",
      url: url,
      data: data,
    }),
};
