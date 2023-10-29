import API_URLS from '../constants/API_URLS';
import TStandardObject from '../types/StandardObject';
import { getAxiosInstance } from '../utils/ajax';


export const getRecentActivityList = async (payload: any): Promise<TStandardObject> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.RECENT_ACTIVITY, payload);
        const formatedData: any = [];
        const data = response?.data.data[0].rows ?? [];
        const totalRecord = response?.data.data[0].totalRecord[0].count;
        data.forEach((x: any, index: number) => {
            formatedData.push({
                contentId: x.content_id || '-',
                templateName: x.content_name || '-',
                property: x.property_name.name || '-',
                // status: `${x.status}-${x.mediaData[0].status}`,
                status: `${x.status || '-'}_${x.mediaData.map((x: any) => x.status || '-')}`,
            });
        });
        return { status: response.status, error: '', data: formatedData, totalRecord };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message };
    }
};
