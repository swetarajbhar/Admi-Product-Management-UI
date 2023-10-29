import API_URLS from '../constants/API_URLS';
import TAPIResponse from '../types/APIResponse';
import TStandardObject from '../types/StandardObject';
import { getAxiosInstance } from '../utils/ajax';


export const thumbnailList = async (params: { [key: string]: number }): Promise<any> => {
    try {
        const response = await getAxiosInstance().get(API_URLS.V1.THUMBNAIL_LIST, { params });
        return { status: response.status, error: '', data: [{ status: response.data.data.status || '', video_url: response.data.data.video_url || '', thumbnails: response.data.data.thumbnails || [] }] };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message };
    }
};

export const thumbnailUpdate = async (payload: TStandardObject): Promise<TAPIResponse> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.THUMBNAIL_UPDATE, payload);
        return { status: response.status, error: '', data: response.data };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message };
    }
};