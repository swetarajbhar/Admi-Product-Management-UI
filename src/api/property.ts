import moment from 'moment';
import API_URLS from '../constants/API_URLS';
import DATE_FORMAT from '../constants/DATE_FORMAT';
import TAPIResponse from '../types/APIResponse';
import TStandardObject from '../types/StandardObject';
import { getAxiosInstance } from '../utils/ajax';
import isEmpty from '../utils/isEmpty';

export interface PropertyList {
    status: number;
    error: string;
    data: (DataEntity)[] | null;
}
export interface DataEntity {
    is_active: boolean;
    _id: string;
    property_name: string;
}

interface IPropertyPayload {
    limit?: number;
    offset: number;
    search_term?: string;
    filter_by?: string;
    start_date?: string;
    end_date?: string;
}

export const propertyList = async (): Promise<PropertyList> => {
    try {
        const response = await getAxiosInstance().get(API_URLS.V1.PROPERTY_LIST);
        return { status: response.status, error: '', data: response.data.data };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message, data: [] };
    }
};

export const propertyMasterList = async (params: TStandardObject): Promise<TStandardObject> => {
    try {
        const response = await getAxiosInstance().get(API_URLS.V1.PROPERTY_MASTER_LIST, { params });
        if (response.status === 200) {
            const { rows, totalRecord } = response.data.data[0];
            const aa = rows.map((data: any, index: number) => ({
                srNo: index + 1 + params.offset,
                propertyId: data.property_id || '-',
                propertyName: data.property_name || '-',
                videoSection: data.video_section?.map((x: string) => x).join(', ') || '-',
                createdBy: data.created_name || '-',
                createdOn: isEmpty(data.created_at) ? '-' : moment(data.created_at).format(DATE_FORMAT.LONG_DATE_FORMAT)
            }));
            return { status: response.status, error: '', data: aa, totalRecord: totalRecord[0].count };
        }
        return { status: response.status, error: '', data: [], totalRecord: 0 };

    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message, data: [] };
    }
};

export const getPropertyDetail = async (params: TStandardObject): Promise<TStandardObject | null> => {
    const response = await getAxiosInstance().get(API_URLS.V1.PROPERTY_MASTER_LIST_ONE, { params });
    if (response.status === 200) {
        const { property_name, video_section, live_url } = response.data.data;
        const data = {
            propertyName: property_name,
            videoSectionData: video_section || [],
            liveUrl: live_url || ''
        };
        return { status: response.status, error: '', data };
    }
    return null;
};

export const saveProperty = async (payload: TStandardObject): Promise<TStandardObject> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.PROPERTY_MASTER_SAVE_UPDATE, payload);
        return { status: response.status, error: '', data: response.data };
    }   
    catch (error: any) {
        console.error('error', error);
        return { status: error.response.status, error: error.response.data.message };
    }
};

export const deleteProperty = async (payload: TStandardObject): Promise<TAPIResponse> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.PROPERTY_MASTER_SAVE_UPDATE, payload);
        return { status: response.status, error: '', data: response.data };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: error.response.status, error: error.message };
    }
};