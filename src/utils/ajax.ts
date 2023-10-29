import axios, { AxiosInstance } from "axios";
import LOCALSTORAGE from "../constants/LOCALSTORAGE";

const getAxiosInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: `https://admin-product-apis.onrender.com`,
    timeout: 60 * 50 * 1000,
    headers: {
      // 'Content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem(LOCALSTORAGE.TOKEN)}`,
    },
  });
};

export { getAxiosInstance };
