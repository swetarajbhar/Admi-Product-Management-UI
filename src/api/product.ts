import API_URLS from "../constants/API_URLS";
import TAPIResponse from "../types/APIResponse";
import TStandardObject from "../types/StandardObject";
import { getAxiosInstance } from "../utils/ajax";

interface IProductPayload {
  limit?: number;
  offset: number;
  searchTerm?: string;
}

type ISaveProductDataPayload = {
  [key: string]: any;
};

export const productList = async (
  payload: IProductPayload
): Promise<TStandardObject> => {
  try {
    const response = await getAxiosInstance().post(
      API_URLS.V1.PRODUCT_LIST,
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

export const saveProductData = async (
  payload: ISaveProductDataPayload
): Promise<any> => {
  try {
    const response = await getAxiosInstance().post(
      API_URLS.V1.SAVE_PRODUCT_DATA,
      payload
    );
    return { status: response.status, error: "", data: response.data };
  } catch (error: any) {
    console.error("error", error);
    console.error("error.response", error.response);
    return { status: error.response.status, error: error.message };
  }
};

export const updateProductData = async (
  payload: ISaveProductDataPayload,
  param: Record<any, any>
): Promise<any> => {
  try {
    const response = await getAxiosInstance().put(
      `${API_URLS.V1.UPDATE_PRODUCT_DATA}${param.sku}`,
      payload
    );
    return { status: response.status, error: "", data: response.data };
  } catch (error: any) {
    console.error("error", error);
    console.error("error.response", error.response);
    return { status: error.response.status, error: error.message };
  }
};

export const findProductById = async (sku: string): Promise<any> => {
  try {
    const response = await getAxiosInstance().get(
      `${API_URLS.V1.FIND_PRODUCT_BY_ID}${sku}`
    );
    return { status: response.status, error: "", data: response.data.data };
  } catch (error: any) {
    console.error("error", error);
    return { status: 400, error: error.message, data: [] };
  }
};

export const deleteProductRecord = async (
  sku: string | number
): Promise<TAPIResponse> => {
  try {
    const response = await getAxiosInstance().delete(
      `${API_URLS.V1.DELETE_PRODUCT_DATA}/${sku}`
    );
    return { status: response.status, error: "", data: response.data };
  } catch (error: any) {
    console.error("error", error);
    return { status: 400, error: error.message };
  }
};
