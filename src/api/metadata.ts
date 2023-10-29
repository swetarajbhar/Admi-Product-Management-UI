import API_URLS from '../constants/API_URLS';
import TAPIResponse from '../types/APIResponse';
import TStandardObject from '../types/StandardObject';
import { getAxiosInstance } from '../utils/ajax';

export const metadataUpdate = async (payload: TStandardObject): Promise<TAPIResponse> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.METADATA_UPDATE, payload);
        return { status: response.status, error: '', data: response.data };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message };
    }
};