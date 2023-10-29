import API_URLS from '../constants/API_URLS';
import TStandardObject from '../types/StandardObject';
import { getAxiosInstance } from '../utils/ajax';

interface IResponseData {
    [key: string]: any,
}

type TAPIResponse = {
    status: number,
    error: string,
    data?: any,
}

export const deleteSubtitleAndAudio = async (params: { [key: string]: any }): Promise<TAPIResponse> => {
    try {
        const response = await getAxiosInstance().get(API_URLS.V1.DELETE_AUDIO_AND_SUBTITLE, { params });
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

export const languageList = async (): Promise<TAPIResponse> => {
    try {
        const response = await getAxiosInstance().get(API_URLS.V1.LANGUAGE_LIST);
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

export const saveSubtitle = async (payload: TStandardObject): Promise<TAPIResponse> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.ADD_SUBTITLE, payload);
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

export const submitAndTranscode = async (payload: TStandardObject): Promise<TAPIResponse> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.SUBMIT_AND_TRANSCODE, payload);
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
export const saveDataToMediaTable = async (payload: TStandardObject): Promise<TAPIResponse> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.SAVE_DATA_TO_MEDIA_TABLE, payload);
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

export const saveAsDraftOrTranscode = async (payload: TStandardObject): Promise<TStandardObject> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.SAVE_AS_DRAFT_OR_TRANSCODE, payload);
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

export const updateVttFile = async (contentId: string, payload: TStandardObject): Promise<TStandardObject> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.UPDATE_VTT_FILE + contentId, payload);
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

export const transcodeVideo = async (contentId: string): Promise<TStandardObject> => {
    try {
        const response = await getAxiosInstance().get(API_URLS.V1.TRANSCODE_VIDEO + contentId);
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