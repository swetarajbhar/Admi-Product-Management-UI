import moment from 'moment';
import API_URLS from '../constants/API_URLS';
import TStandardObject from '../types/StandardObject';
import { getAxiosInstance } from '../utils/ajax';
import isEmpty from '../utils/isEmpty';

export interface VideoDetail {
    video_url?: string;
    raw_file: RawFileOrCustomThumbnail;
    template: Template;
    transcoding_profile: TranscodingProfile;
    meta_data: MetaData;
    custom_thumbnail: RawFileOrCustomThumbnail;
    status: string;
    media_job_id: string;
    is_active: boolean;
    _id: string;
    content_id: string;
    __v: number;
    audio?: (null)[] | null;
    content_name: string;
    created_at: string;
    created_by: string;
    created_name: string;
    property_name: TStandardObject;
    srt?: (null)[] | null;
    type: string;
    updated_at: string;
    uploaded_on: string;
    file_input_path: string;
    output_path: string;
    transcoding_start_time: string;
    duration: string;
    transcoding_completion_time: string;
    updated_by: string;
    updated_name: string;
    push_data: PushData;
    content_duration: string;
}
export interface RawFileOrCustomThumbnail {
    name: string;
    url: string;
}
export interface Template {
    start_bumper: StartBumperOrEndBumper;
    end_bumper: StartBumperOrEndBumper;
    template_id: string;
    template_name: string;
    property_name: string;
}
export interface StartBumperOrEndBumper {
    name: string;
    s3_url: string;
}
export interface TranscodingProfile {
    resolutions?: (string)[] | null;
    profile_name: string;
}
export interface MetaData {
    section: Section | null;
    tags?: (string)[] | [''];
    regional_tags?: (string)[] | [''];
    tv_shows?: (string)[] | null;
    title: string;
    mobile_title: string;
    slug: string;
    description: string;
    author: string;
    user: string;
    property: (PropertyEntity)[];
    regional_title: string;
    mobile_regional_title: string;
    slug_regional: string;
    regional_description: string;
    is_breaking_news: boolean;
    for_google_assistant: boolean;
    catalogue?: (CatalogueEntity)[] | null;
    is_post_to_twitter: boolean;
    twitter_title: string;
    is_post_to_instagram: boolean;
    instagram_title: string;
    is_post_to_youtube: boolean;
    youtube_title: string;
}
export interface Section {
    section_id: string;
    section_name: string;
}
export interface PropertyEntity {
    property_id: string;
    property_name: string;
}
export interface CatalogueEntity {
    _id: string;
    catalogue_id: string;
    catalogue_name: string;
}
export interface PushData {
    is_post_to_twitter: boolean;
    twitter_title: string;
    is_post_to_instagram: boolean;
    instagram_title: string;
    is_post_to_youtube: boolean;
    youtube_title: string;
    push_date_time: Date;
    push_schedule: string;
}

interface ISubtitlePayload {
    limit?: number;
    offset?: number;
}

export const getContentDetails = async (contentID: string | number, params: ISubtitlePayload = {}): Promise<TStandardObject | null> => {
    const aa = await getAxiosInstance().get(`${API_URLS.V1.VIDEO_LIBRARY_LIST}/${contentID}`, { params });
    if (aa.status === 200) {
        const {
            vtt = [],
            totalCount
        } = aa?.data?.data?.transcript_vtt_data || {};
        return {
            ...aa.data.data,
            // ...vtt,
            // totalCount
        };
    }
    return null;
};

export const getVideoDetail = async (contentID: string | number, pathStep = 0): Promise<VideoDetail | null> => {
    const aa = await getAxiosInstance().get(`${(pathStep === 2) ? API_URLS.V1.RAW_VIDEO_FIND_BY_CONTENT_ID : API_URLS.V1.VIDEO_LIBRARY_VIDEO_DETAIL}${contentID}`);
    if (aa.status === 200) {
        const {
            section,
            tags: tagEnglish,
            regional_tags: tagRegional,
            tv_shows,
            title,
            mobile_title: mobileTitle,
            slug: slugEnglish,
            description: descriptionEnglish,
            // author,
            user,
            property,
            regional_title: titleRegional,
            mobile_regional_title: mobileTitleRegional,
            slug_regional: slugRegional,
            regional_description: descriptionRegional,
            is_breaking_news,
            for_google_assistant,
            catalogue,
            // is_post_to_twitter,
            // twitter_title: postToTwtTitle,
            // is_post_to_instagram,
            // instagram_title: postToInstaTitle,
            // is_post_to_youtube,
            // youtube_title: postToYoutubeTitle,
        } = aa.data.data.meta_data;
        const {
            is_post_to_twitter,
            twitter_title: postToTwtTitle,
            is_post_to_instagram,
            instagram_title: postToInstaTitle,
            is_post_to_youtube,
            youtube_title: postToYoutubeTitle,
            push_date_time,
            push_schedule: scheduleThePush,
        } = aa?.data?.data?.push_data || {};
        return {
            ...aa.data.data,
            meta_data: {
                ...aa.data.data.meta_data,
                section,
                tagEnglish,
                tagRegional,
                // tvShows: tv_shows.join(', '),
                tvShows: tv_shows,
                title,
                mobileTitle,
                slugEnglish,
                descriptionEnglish,
                // author,
                user,
                property,
                titleRegional,
                mobileTitleRegional,
                slugRegional,
                descriptionRegional,
                is_breaking_news,
                for_google_assistant,
                catalogue,
                // postToTwitter: is_post_to_twitter,
                // postToTwtTitle,
                // postToInstagram: is_post_to_instagram,
                // postToInstaTitle,
                // postToYoutube: is_post_to_youtube,
                // postToYoutubeTitle,
            },
            push_data: {
                is_post_to_twitter,
                twitter_title: postToTwtTitle,
                is_post_to_instagram,
                instagram_title: postToInstaTitle,
                is_post_to_youtube,
                youtube_title: postToYoutubeTitle,
                // push_date_time: isEmpty(push_date_time) ? '' : moment(push_date_time).utcOffset('+05:30').toDate(),
                push_date_time: isEmpty(push_date_time) ? '' : new Date(moment.utc(push_date_time).format('YYYY-MM-DD HH:mm:ss')),
                push_schedule: scheduleThePush,
            }
        };
    }
    return null;
};

export const getRawVideoDetail = async (contentID: string | number): Promise<VideoDetail | null> => {
    const response = await getAxiosInstance().get(`${API_URLS.V1.RAW_VIDEO_FIND_BY_CONTENT_ID}${contentID}`);
    if (response.status === 200) {
        return response.data.data;
    }
    return null;
};

export const updateS3VideoStatus = async (id: string, params: TStandardObject): Promise<any> => {
    try {
        const response = await getAxiosInstance().get(API_URLS.V1.UPDATE_VIDEO_STATUS + id, { params });
        return { status: response.status, error: '', data: response.data };
    }
    catch (error: any) {
        console.error('error', error);
        return { status: error.response.status, error: error.message };
    }
};