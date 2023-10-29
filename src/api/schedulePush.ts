import API_URLS from '../constants/API_URLS';
import TStandardObject from '../types/StandardObject';
import { getAxiosInstance } from '../utils/ajax';

export const schedulePush = async (payload: TStandardObject): Promise<any> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.SCHEDULE_PUSH, payload);
        return { status: response.status, error: '', data: response.data };
    }
    catch (error: any) {
        console.error('error.response', error.response);
        return { status: error.response.status, error: error.message };
    }
};
