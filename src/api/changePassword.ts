import API_URLS from '../constants/API_URLS';
import TAPIResponse from '../types/APIResponse';
import { getAxiosInstance } from '../utils/ajax';



interface IChangePasswordPayload {
    old_password: string;
    new_password: string;
}

export const updatePassword = async (payload: IChangePasswordPayload): Promise<TAPIResponse> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.CHANGE_PASSWORD, payload);
        return { status: response.status, error: '' };
    }
    catch (error: any) {
        return { status: error.response.status, error: error.response.data.message };
    }
};
