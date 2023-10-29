import API_URLS from '../constants/API_URLS';
import TAPIResponse from '../types/APIResponse';
import TStandardObject from '../types/StandardObject';
import { getAxiosInstance } from '../utils/ajax';
import { convertBufferToBase64Image } from '../utils/convertBufferToBase64Image';
import isEmpty from '../utils/isEmpty';

interface IVideoLibraryPayload {
    limit?: number;
    offset: number;
    search_term?: string;
    filter_by?: string;
    start_date?: string;
    end_date?: string;
}

interface IVideoSectionDeletePayload {
    content_id: string,
    status: string,
    is_video_edited: boolean,
    data: Array<{
        startTime: string,
        endTime: string
    }>
}

type ISaveVideoDataPayload = {
    [key: string]: any,
}

export const videoLibraryList = async (payload: IVideoLibraryPayload): Promise<TStandardObject> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.VIDEO_LIBRARY_LIST, payload);
        return { status: response.status, error: '', data: response.data.data[0].rows, totalRecord: response.data.data[0].totalRecord[0].count };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message, data: [] };
    }
};

export const videoLibraryGetScreenshots = async (fileURL: string): Promise<any> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.VIDEO_LIBRARY_VIDEO_SCREENSHOTS, { fileURL });
        const images: any = [[]];
        let currentSection = 0;
        response?.data?.data?.forEach((x: typeof Buffer, i: number) => {
            if (isEmpty(images[currentSection])) {
                images.push([]);
            }
            if (images[currentSection]?.length === 10) {
                currentSection += 1;
                images.push([]);
            }
            images[currentSection] = [...images[currentSection], {
                id: i,
                src: convertBufferToBase64Image(x),
                show: true,
            }];
        });
        return { status: response.status, error: '', data: images };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message, data: [] };
    }
};


export const videoLibraryDeleteSection = async (payload: IVideoSectionDeletePayload): Promise<any> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.VIDEO_LIBRARY_VIDEO_EDIT, payload);
        return { status: response.status, error: '', data: [] };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message, data: [] };
    }
};

export const saveVideoData = async (payload: ISaveVideoDataPayload): Promise<any> => {
    try {
        const response = await getAxiosInstance().post(API_URLS.V1.SAVE_VIDEO_DATA, payload);
        return { status: response.status, error: '', data: response.data };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message };
    }
};

export const deleteVideoRecord = async (contentID: string | number): Promise<TAPIResponse> => {
    try {
        const response = await getAxiosInstance().delete(`${API_URLS.V1.DELETE_VIDEO_DATA}/${contentID}`);
        return { status: response.status, error: '', data: response.data };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message };
    }
};

export const cloneVideoRecord = async (contentID: string | number): Promise<TAPIResponse> => {
    try {
        const response = await getAxiosInstance().get(`${API_URLS.V1.CLONE_VIDEO_RECORD}/${contentID}`);
        return { status: response.status, error: '', data: response.data.data };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: 400, error: error.message };
    }
};