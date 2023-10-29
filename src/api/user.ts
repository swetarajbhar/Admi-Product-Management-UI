import API_URLS from "../constants/API_URLS";
import TAPIResponse from "../types/APIResponse";
import TStandardObject from "../types/StandardObject";
import { getAxiosInstance } from "../utils/ajax";

interface IUserPayload {
  limit?: number;
  offset: number;
  search_term?: string;
  filter_by?: string;
  start_date?: string;
  end_date?: string;
}

type ISaveUserDataPayload = {
  [key: string]: any;
};

export const userList = async (
  payload: IUserPayload
): Promise<TStandardObject> => {
  try {
    const response = await getAxiosInstance().post(
      API_URLS.V1.USER_LIST,
      payload
    );
    return {
      status: response.status,
      error: "",
      data: response.data.data[0].rows,
      totalRecord: response.data.data[0].totalRecord[0].count,
    };
  } catch (error: any) {
    console.error("error", error);
    return { status: 400, error: error.message, data: [] };
  }
};

export const saveUserData = async (
  payload: ISaveUserDataPayload
): Promise<any> => {
  try {
    const response = await getAxiosInstance().post(
      API_URLS.V1.SAVE_USER_DATA,
      payload
    );
    return { status: response.status, error: "", data: response.data };
  } catch (error: any) {
    console.error("error", error);
    console.error("error.response", error.response);
    return { status: error.response.status, error: error.message };
  }
};

export const findUserById = async (userId: string): Promise<any> => {
  try {
    const response = await getAxiosInstance().get(
      `${API_URLS.V1.FIND_USER_BY_ID}${userId}`
    );
    return { status: response.status, error: "", data: response.data.data };
  } catch (error: any) {
    console.error("error", error);
    return { status: 400, error: error.message, data: [] };
  }
};

export const deleteUserRecord = async (
  contentID: string | number
): Promise<TAPIResponse> => {
  try {
    const response = await getAxiosInstance().delete(
      `${API_URLS.V1.DELETE_USER_DATA}/${contentID}`
    );
    return { status: response.status, error: "", data: response.data };
  } catch (error: any) {
    console.error("error", error);
    return { status: 400, error: error.message };
  }
};
