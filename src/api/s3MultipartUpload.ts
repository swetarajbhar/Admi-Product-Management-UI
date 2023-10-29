import API_URLS from '../constants/API_URLS';
import TStandardObject from '../types/StandardObject';
import { getAxiosInstance } from '../utils/ajax';

interface IResponseData {
    [key: string]: any,
}

type TGetUploadIdAPIResponse = {
    status: number,
    error: string,
    data?: IResponseData,
}

type TAPIResponse = {
    status: number,
    error: string,
    data?: any,
}

export const getUploadID = async (payload: TStandardObject): Promise<TGetUploadIdAPIResponse> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.S3_MULTIPART_GET_UPLOAD_ID, payload);
        return {
            status: response.status, error: '',
            data: response.data.data,
        };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message };
    }
};

export const getSignedUrl = async (params: { [key: string]: any }): Promise<TAPIResponse> => {
    try {
        const response = await getAxiosInstance().get(API_URLS.V1.S3_MULTIPART_GET_SIGNED_URL, { params });
        return {
            status: response.status, error: '',
            data: response.data.data,
        };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message };
    }
};

export const completeMultipartUpload = async (payload: { [key: string]: any }): Promise<TAPIResponse> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.S3_MULTIPART_COMPLETE_UPLOAD, payload);
        return {
            status: response.status, error: '',
            data: response.data.data,
        };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message };
    }
};

export const saveVideoDetails = async (payload: TStandardObject): Promise<TAPIResponse> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.SAVE_VIDEO_DETAILS, payload);
        return {
            status: response.status, error: '',
            data: response.data?.data,
        };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message };
    }
};

export const getPresignedUrl = async (payload: TStandardObject): Promise<TAPIResponse> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.GET_PRESIGNED_URL, payload);
        return {
            status: response.status, error: '',
            data: response.data.data,
        };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message };
    }
};

export const transcribecontent = async (payload: TStandardObject): Promise<TAPIResponse> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.TRANSCRIBE_CONTENT, payload);
        return {
            status: response.status, error: '',
            data: response.data?.data,
        };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message };
    }
};