
const CONSTANTS = {
    STATUS: {
        UPLOADED: 'Uploaded',
        EDITING: 'Editing',
        EDITED: 'Edited',
        SAVED_AS_DRAFT: 'Saved As Draft',
        TRANSCODED: 'Transcoded',
        IN_PROGRESS: 'In Progress',
        FAILED: 'Failed',
        PUBLISHED: 'Published',
        COMPLETED: 'Completed'
    },
    TRANSCODING_STATUS: [
        { id: '1', label: 'All', value: '' },
        { id: '2', label: 'Uploaded', value: 'Uploaded' },
        { id: '3', label: 'Edited', value: 'Edited' },
        { id: '4', label: 'Saved As Draft', value: 'Saved As Draft' },
        { id: '5', label: 'Transcoded', value: 'Transcoded' },
        { id: '6', label: 'In Progress', value: 'In Progress' },
        { id: '7', label: 'Failed', value: 'Failed' },
        { id: '8', label: 'Published', value: 'Published' },
    ],
    PUSH_STATUS: [
        { id: '1', label: 'All', value: '' },
        { id: '2', label: 'Published', value: 'Published' },
        { id: '3', label: 'Unpublished', value: 'Unpublished' },
    ],
    ACTION: {
        VIEW: 'view',
        EDIT: 'edit',
        DELETE: 'delete',
        ADD: 'add',
        CLONE:'clone',
    },
    FILTER_BY: {
        SEARCH_TEXT: 'search_text',
        DATE_RANGE: 'date_range',
    },
    VIDEO_LIBRARY_REPORT: 'Video Library.csv',
    USER_REPORT: 'User.csv',
    UPLOAD_METHOD: {
        FROM_COMPUTER: 'fromComputer',
        FROM_S3_UPLOAD: 'fromS3Upload',
        CHOOSE_FROM_LAST_RECORD: 'chooseFromLastRecord',
    },
    VIDEO_TYPE: {
        MP4: 'MP4',
        HLS: 'HLS',
    },
    MODAL_TYPE: {
        SUBTITLE_MODAL: 'subtitle',
        AUDIO_MODAL: 'audio'
    },
    SCHEDULE_THE_PUSH: {
        PUSH_NOW_POST_TRANSCODING: 'Post Transcoding',
        SCHEDULE_FOR_LATER: 'Schedule Later',
    },
    THUMBNAIL_SELECTED: {
        FROM_LOCAL: 'local',
        FROM_S3: 's3',
    },
    DATE_FORMAT: 'dd/MM/yyyy',
    DATE_PLACEHOLDER: 'DD/MM/YYYY',
    VIDEO_LIBRARY_STATUS: [
        { id: '1', label: 'All', value: '' },
        { id: '4', label: 'Saved As Draft', value: 'Saved As Draft' },
        { id: '5', label: 'Transcoded', value: 'Transcoded' },
        { id: '6', label: 'In Progress', value: 'In Progress' },
        { id: '7', label: 'Failed', value: 'Failed' },
        { id: '8', label: 'Published', value: 'Published' },
    ],
    UPLOAD_TYPE: {
        UPLOAD_FROM_COMPUTER: 'upload_from_computer',
        FINAL_EDITED_VIDEO: 'final_edited_video',
        START_BUMPER: 'start_bumper',
        END_BUMPER: 'end_bumper',
        ADDITIONAL_AUDIO: 'additional_audio'
    }
};

export default CONSTANTS;
