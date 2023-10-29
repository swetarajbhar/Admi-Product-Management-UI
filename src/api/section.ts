import API_URLS from '../constants/API_URLS';
import TAPIResponse from '../types/APIResponse';
import { getAxiosInstance } from '../utils/ajax';


export const sectionList = async (): Promise<TAPIResponse> => {
    try {
        const response = await getAxiosInstance().get(API_URLS.V1.SECTION_LIST);
        return { status: response.status, error: '', data: response.data.data };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message };
    }
};