import API_URLS from '../constants/API_URLS';
import TStandardObject from '../types/StandardObject';
import { getAxiosInstance } from '../utils/ajax';

type ITrimDataPayload = {
    [key: string]: any,
}


export const trimLiveVideo = async (payload: ITrimDataPayload): Promise<any> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.TRIM_LIVE_VIDEO, payload);
        return { status: response.status, error: '', data: response.data };
    }
    catch (error: any) {
        console.error('error', error);
        console.error('error.response', error.response);
        return { status: error.response.status, error: error.message };
    }
};