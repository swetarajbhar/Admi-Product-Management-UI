import axios, { AxiosInstance } from "axios";
import LOCALSTORAGE from "../constants/LOCALSTORAGE";

const getAxiosInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}`,
    timeout: 60 * 50 * 1000,
    headers: {
      // 'Content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem(LOCALSTORAGE.TOKEN)}`,
    },
  });
};

export { getAxiosInstance };
