import moment from 'moment';
import API_URLS from '../constants/API_URLS';
import DATE_FORMAT from '../constants/DATE_FORMAT';
import TAPIResponse from '../types/APIResponse';
import TStandardObject from '../types/StandardObject';
import { getAxiosInstance } from '../utils/ajax';
import isEmpty from '../utils/isEmpty';


export const templateList = async (params: { [key: string]: number }): Promise<TAPIResponse> => {
    try {
        const response = await getAxiosInstance().get(API_URLS.V1.TEMPLATE_LIST, { params });
        return { status: response.status, error: '', data: response.data.data };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message };
    }
};

export const getTemplateMasterList = async (payload: any): Promise<TStandardObject> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.TEMPLATE_MASTER_LIST, payload);
        const formatedData: any = [];
        const data = response?.data.data ?? [];
        const totalRecord = response.data.data[0].totalRecord[0].count;
        data[0].rows.forEach((x: any, index: number) => {
            // if (x.is_active) {
                formatedData.push({
                    srNo: index + 1 + payload.offset,
                    templateId: x.template_id || '-',
                    templateName: x.template_name || '-',
                    property: x.property.reduce((acc: string, curr: TStandardObject) => (`${acc}${isEmpty(acc) ? '' : ', '}${curr.name}`), '') || '-',
                    ceatedBy: x.created_name || '-',
                    createdAt: isEmpty(x.created_at) ? '-' : moment(x.created_at).format(DATE_FORMAT.LONG_DATE_FORMAT),
                    isActive: x.is_active ? 'Active' : 'Inactive',
                });
            // }
        });
        return { status: response.status, error: '', data: formatedData, totalRecord };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message };
    }
};

export const findTemplateById = async (tepmplateId: string): Promise<any> => {
    try {
        const response = await getAxiosInstance().get(`${API_URLS.V1.FIND_TEMPLATE_BY_ID}/${tepmplateId}`);
        return { status: response.status, error: '', data: response.data.data };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message, data: [] };
    }
};

export const deleteTemplateRecord = async (templateId: string | number): Promise<TAPIResponse> => {
    try {
        const response = await getAxiosInstance().delete(`${API_URLS.V1.DELETE_TEMPLATE_DATA}/${templateId}`);
        return { status: response.status, error: '', data: response.data };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message };
    }
};

export const saveTemplateData = async (payload: TStandardObject): Promise<any> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.SAVE_TEMPLATE_DATA, payload);
        return { status: response.status, error: '', data: response.data };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message };
    }
};


export const getUploadID = async (payload: TStandardObject): Promise<any> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.TEMPLATE_BUMPER_GET_UPLOAD_ID, payload);
        return {
            status: response.status, error: '',
            data: response.data.data,
        };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message };
    }
};

export const getSignedUrl = async (params: { [key: string]: any }): Promise<any> => {
    try {
        const response = await getAxiosInstance().get(API_URLS.V1.TEMPLATE_BUMPER_GET_SIGNED_URL, { params });
        return {
            status: response.status, error: '',
            data: response.data.data,
        };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message };
    }
};

export const completeMultipartUpload = async (payload: { [key: string]: any }): Promise<any> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.TEMPLATE_BUMPER_COMPLETE_UPLOAD, payload);
        return {
            status: response.status, error: '',
            data: response.data.data,
        };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message };
    }
};
