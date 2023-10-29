import API_URLS from '../constants/API_URLS';
import TAPIResponse from '../types/APIResponse';
import { getAxiosInstance } from '../utils/ajax';

interface IDashboardGraphPayload {
    property_name: string,
    year: string,
}

interface IDashboardCardPayload {
    property_name: string;
    start_date: Date;
    end_date: Date;
}

export interface DashboardCard {
    totalVideoUploaded: string;
    totalTranscodedVideo: string;
    totalEditedVideo: string;
    totalVideoPushed: string;
}

export const getDashboardGraphData = async (payload: IDashboardGraphPayload): Promise<TAPIResponse> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.DASHBOARD_GRAPHS, payload);
        if (response.status === 200) {
            return { status: response.status, error: '', data: response.data.data };
        }
        return { status: response.status, error: response.data.message };
    } catch (error: any) {
        console.log('error', error);
        return { status: 400, error: error.message };
    }
};

export const getDashboardCardData = async (payload: IDashboardCardPayload): Promise<DashboardCard> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.DASHBOARD_CARDS, payload);
        if (response.status === 200) {
            const { total_video_uploaded: totalVideoUploaded,
                total_transcoded_video: totalTranscodedVideo,
                total_edited_video: totalEditedVideo,
                total_video_pushed: totalVideoPushed, } = response.data.data;

            return {
                totalVideoUploaded,
                totalTranscodedVideo,
                totalEditedVideo,
                totalVideoPushed,
            };
        }
        return {
            totalVideoUploaded: '0',
            totalTranscodedVideo: '0',
            totalEditedVideo: '0',
            totalVideoPushed: '0',
        };
    } catch (error: any) {
        console.log('error', error);
        return {
            totalVideoUploaded: '0',
            totalTranscodedVideo: '0',
            totalEditedVideo: '0',
            totalVideoPushed: '0',
        };
    }
};