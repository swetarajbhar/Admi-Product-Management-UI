import moment from 'moment';
import API_URLS from '../constants/API_URLS';
import DATE_FORMAT from '../constants/DATE_FORMAT';
import TStandardObject from '../types/StandardObject';
import { getAxiosInstance } from '../utils/ajax';
import isEmpty from '../utils/isEmpty';


export const getNotificationList = async (params?: TStandardObject): Promise<TStandardObject> => {
    try {
        const response = await getAxiosInstance().get(API_URLS.V1.NOTIFICATION_LIST, { params });
        const formatedData: any = [];
        const data = response?.data.data ?? [];
        data.forEach((x: any) => {
            formatedData.push({
                id: x._id,
                notification: x.message,
                isSeen: x.is_seen,
                createdAt: isEmpty(x.created_at) ? '-' : moment(x.created_at).format(DATE_FORMAT.LONG_DATE_FORMAT),
            });
        });
        return { status: response.status, error: '', data: formatedData };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message };
    }
};
export const clearAllNotifications = async (payload: any): Promise<TStandardObject> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.CLEAR_ALL_NOTIFICATIONS, payload);
        return { status: response.status, error: '', data: response.data };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message };
    }
};
