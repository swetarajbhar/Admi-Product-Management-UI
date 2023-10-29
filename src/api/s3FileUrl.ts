import axios from 'axios';
import API_URLS from '../constants/API_URLS';
import TAPIResponse from '../types/APIResponse';
import { getAxiosInstance } from '../utils/ajax';


export const s3FileUrlList = async (params: {[key: string]: any}): Promise<TAPIResponse> => {
    try {
        const response = await getAxiosInstance().get(API_URLS.V1.LIST_S3_VIDEOS, { params });
        return { status: response.status, error: '', data: response.data.data[0].rows };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message };
    }
};

export const s3FileUrlUpdate = async (params: {[key: string]: any}): Promise<TAPIResponse> => {
    try {
        const response = await axios.post(process.env.REACT_APP_BASE_URL + API_URLS.V1.UPDATE_S3_VIDEO_STATUS, params);
        return { status: response.status, error: '', data: response.data };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message };
    }
};


