import API_URLS from "../constants/API_URLS";
import LOCALSTORAGE from "../constants/LOCALSTORAGE";
import TAPIResponse from "../types/APIResponse";
import TStandardObject from "../types/StandardObject";
import { getAxiosInstance } from "../utils/ajax";
import isEmpty from "../utils/isEmpty";

interface ILoginPayload {
  email: string;
  password: string;
}

interface IForgotPasswordPayload {
  email: string;
}

interface IResetPasswordPayload {
  password: string;
  confirm_password: string;
}

export const loginUser = async (
  payload: ILoginPayload
): Promise<TAPIResponse> => {
  try {
    const response = await getAxiosInstance().post(API_URLS.V1.LOGIN, payload);
    const { xAccessToken = "", name = "" } = response.data.data;
    localStorage.setItem(LOCALSTORAGE.TOKEN, xAccessToken);
    localStorage.setItem(LOCALSTORAGE.USER_NAME, name);
    localStorage.setItem(LOCALSTORAGE.USER_EMAIL, payload.email);
    localStorage.setItem(LOCALSTORAGE.IS_AUTHENTICATED, "true");
    return { status: response.status, error: "" };
  } catch (error: any) {
    console.log("error", error);
    return { status: 400, error: error.message };
  }
};

export const logOut = async (): Promise<TAPIResponse> => {
  try {
    const response = await getAxiosInstance().delete(API_URLS.V1.LOGOUT);
    localStorage.clear();
    return { status: response.status, error: "" };
  } catch (error: any) {
    console.log("error", error);
    return { status: 400, error: error.message };
  }
};
