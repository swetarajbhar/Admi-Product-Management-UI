import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Select, { components, createFilter } from 'react-select';
import { propertyList } from '../../api/property';
import { s3FileUrlList, s3FileUrlUpdate } from '../../api/s3FileUrl';
import { completeMultipartUpload, getSignedUrl, getUploadID } from '../../api/s3MultipartUpload';
import { templateList } from '../../api/template';
import { saveVideoData } from '../../api/videoLibrary';
import { ReactComponent as CloseIcon } from '../../assets/SVG/closeIcon.svg';
import { ReactComponent as DownloadIcon } from '../../assets/SVG/downloadIcon.svg';
import { ReactComponent as UploadIcon } from '../../assets/SVG/uploadIcon.svg';
import CONSTANTS from '../../constants/constants';
import DATE_FORMAT from '../../constants/DATE_FORMAT';
import TStandardObject from '../../types/StandardObject';
import isEmpty from '../../utils/isEmpty';
import { RECENT_ACTIVITY } from '../../utils/routes';
import Button from '../Button/Button';
import Entry from '../Entry/Entry';
import MessagePopup from '../MessagePopup/MessagePopup';
import Table from '../Table/Table';
import VideoPreviewModal from '../VideoPreviewModal/VideoPreviewModal';
import VideoValidationNote from '../VideoValidationNote/VideoValidationNote';
import styles from './SelectBulkVideo.module.scss';
interface objectData {
    [key: string]: any;
}

interface SelectVideoProps {
    title?: string;
    propertyData?: any;
    templateData?: any;
    onRedirect?: (type: string, payload?: { [key: string]: any }) => void
    updateContentIdAndProperty?: (contentID: string, propertyName: TStandardObject) => void
}

let aa: any;

const Option = (props: any) => {
    return (
        <components.Option {...props}>
            <div className={styles.optionItemWrapper}>
                <span>{props.label}</span>
                <a href={props.data.url || ''} download><DownloadIcon /></a>
            </div>
        </components.Option>
    );
};

const SelectBulkVideo = ({ title = '', propertyData: _propertyData, templateData: _templateData, onRedirect, updateContentIdAndProperty }: SelectVideoProps): JSX.Element => {

    const [uploadMethod, setUploadMethod] = useState(CONSTANTS.UPLOAD_METHOD.FROM_COMPUTER);
    const [videoType, setVideoType] = useState(CONSTANTS.VIDEO_TYPE.MP4);
    const [property, setProperty] = useState(null);
    const [template, setTemplate] = useState<any>(null);
    const [videoTitle, setVideoTitle] = useState('');
    const [fileName, setFileName] = useState('');
    const [uploadFile, setUploadFile] = useState<File | any>();
    const [showUploadProgress, setShowUploadProgress] = useState(false);
    const [videoPreviewModal, setVideoPreviewModal] = useState(false);
    const [propertyData, setPropertyData] = useState<Array<objectData>>([]);
    const [templateData, setTemplateData] = useState<Array<objectData>>([]);
    const [s3FileUrl, setS3FileUrl] = useState<any | null>([]);
    const [s3FileUrlData, setS3FileUrlData] = useState<Array<objectData>>([]);
    const [chooseFromLastRecordData, setChooseFromLastRecordData] = useState<Array<objectData>>([]);
    const [percentDone, setPercentDone] = useState(0);
    const [popupMessage, setPopupMessage] = useState({ show: false, msg: '' });
    const [loading, setLoading] = useState(false);
    const [duration, setDuration] = useState('');
    const [error, setError] = useState({
        videoTitle: false,
        videoType: false,
        property: false,
        template: false,
        uploadFile: false,
        s3FileUrl: false,
    });
    const [totalCount, setTotalCount] = useState(0);
    const [currentCount, setCurrentCount] = useState(0);
    const [uploadFileSize, setUploadFileSize] = useState('');

    const history = useHistory();

    const s3TableHeader = ['Video ID / Name', 'Video Title', 'Created On'];

    useEffect(() => {
        // getPropertyData();
        const propData = JSON.parse(localStorage['PROPERTY']);
        if (propData && propData[0] !== null) {
            setPropertyData(propData);
        }
    }, []);

    useEffect(() => {
        if (percentDone >= 90) {
            clearInterval(aa?._id);
        }
    }, [percentDone]);

    useEffect(() => {
        setProperty(_propertyData);
        // setTemplate(templateName);
        setVideoTitle(title);
        if (_propertyData) {
            getTemplateData(_propertyData.id);
        }
    }, [title, _templateData, _propertyData]);

    const getPropertyData = async () => {
        const response = await propertyList();
        if (response.status === 200) {
            const responseData = response?.data ?? [];
            const data = responseData.map((item: any) => ({ id: item._id, value: item.property_name, label: item.property_name }));
            setPropertyData(data);
        } else {
            setPropertyData([]);
        }
    };

    const getTemplateData = async (id: number) => {
        const response = await templateList({ property_id: id });
        if (response.status === 200) {
            const responseData = response?.data ?? [];
            const data = responseData.map((item: any) => (
                {
                    id: item.template_id,
                    value: item.template_name,
                    label: item.template_name,
                    startBumper: { name: item.start_bumper.name, s3_url: item.start_bumper.s3_url },
                    endBumper: { name: item.end_bumper.name, s3_url: item.end_bumper.s3_url },
                    propertyName: item.property_name.filter((x: any) => x !== null)[0],
                }
            ));
            setTemplateData(data);
        } else {
            setTemplateData([]);
        }
    };

    const formatDateTime = (date: any) => {
        const dateTime = date.split('T');
        return moment.parseZone(`${dateTime[0]} ${dateTime[1]}`).format(DATE_FORMAT.LONG_DATE_FORMAT);
    };

    const getS3FileUrlData = async (params: { [key: string]: string | boolean }) => {
        const response = await s3FileUrlList(params);
        if (response.status === 200) {
            const responseData = response?.data ?? [];
            const formatedData: Array<{ [key: string]: any }> = [];
            const data = responseData.map((item: any, index: number) => {
                uploadMethod === CONSTANTS.UPLOAD_METHOD.CHOOSE_FROM_LAST_RECORD && formatedData.push({
                    videoId: item.content_name || item.content_id,
                    videoTitle: item.content_name || item.content_id,
                    createdOn: isEmpty(item.uploaded_on) ? '-' : formatDateTime(item.uploaded_on),
                    rawUrl: item.raw_file.url || '',
                });
                return {
                    id: index,
                    value: item.content_id,
                    label: `${item.content_name || item.content_id} ${isEmpty(item.uploaded_on) ? '-' : formatDateTime(item.uploaded_on)}`,
                    rawFileName: item.raw_file.name,
                    url: item.raw_file.url,
                    createdOn: item.uploaded_on,
                    fileSize: item.file_size || '',
                };
            });
            setS3FileUrlData(data);
            setChooseFromLastRecordData(formatedData);
        } else {
            setS3FileUrlData([]);
            setChooseFromLastRecordData([]);
        }

    };

    const uploadMethodSelected = (e: any) => {
        setUploadMethod(e.target.value);
        clearAllFields();
    };

    const clearAllFields = () => {
        setCurrentCount(0);
        setUploadFileSize('');
        setProperty(null); //
        setTemplate(null); //
        // setTemplateData([]);
        setChooseFromLastRecordData([]);
        setUploadFile(undefined);
        setFileName('');
        setVideoTitle('');
        setS3FileUrl([]);
        setS3FileUrlData([]);
        setError({
            videoTitle: false,
            videoType: false,
            property: false,
            template: false,
            uploadFile: false,
            s3FileUrl: false,
        });
    };

    const videoTypeSelected = (e: any) => {
        setVideoType(e.target.value);
    };

    const onPropertyChange = (e: any) => {
        setTemplate(null);
        setS3FileUrl([]);
        setTemplateData([]);
        setProperty(e);
        setError({
            ...error,
            property: isEmpty(e),
        });
        if (e) getTemplateData(e.id);
        if (uploadMethod === CONSTANTS.UPLOAD_METHOD.FROM_S3_UPLOAD || uploadMethod === CONSTANTS.UPLOAD_METHOD.CHOOSE_FROM_LAST_RECORD) {
            setS3FileUrlData([]);
            setChooseFromLastRecordData([]);
            const params = {
                property_name: e ? e['value'] : '',
                is_limit: uploadMethod === CONSTANTS.UPLOAD_METHOD.CHOOSE_FROM_LAST_RECORD,
            };
            getS3FileUrlData(params);
        }
    };

    const onTemplateChange = (e: any) => {
        setTemplate(e);
        // setError({
        //     ...error,
        //     template: isEmpty(e),
        // });
    };

    const onS3FileChange = (e: any) => {
        setS3FileUrl(e);
        // !videoTitle && setVideoTitle(e.label.split(' ')[0]);
        setError({
            ...error,
            s3FileUrl: isEmpty(e) || e.length <= 0 || e.length > 30
        });
        if (uploadMethod === CONSTANTS.UPLOAD_METHOD.FROM_S3_UPLOAD) {
            const data: any = [];
            if (e) {
                e.forEach((x: any) => {
                    data.push({
                        videoId: x.value,
                        videoTitle: x.value,
                        createdOn: isEmpty(x.createdOn) ? '-' : formatDateTime(x.createdOn),
                        rawUrl: x.url || '',
                    });
                });
            }
            setChooseFromLastRecordData(data);
        }
    };

    const propertyDropdown = () => {
        return (
            <div>
                <Select
                    closeMenuOnSelect
                    onChange={onPropertyChange}
                    value={property}
                    placeholder="Select Property"
                    options={propertyData}
                />
                {error.property && <small className={styles.errorMessage}>Please select property</small>}
            </div>
        );
    };

    const templateDropdown = () => {
        return (
            <div>
                <Select
                    closeMenuOnSelect
                    onChange={onTemplateChange}
                    value={template}
                    placeholder="Select Template"
                    options={templateData}
                    filterOption={createFilter({ ignoreAccents: false })}
                />
                {/* {error.template && <small className={styles.errorMessage}>Please select template</small>} */}
            </div>
        );
    };

    const fromComputerForm = () => {
        return (
            <>
                <div className={styles.computerUploadContainer}>
                    <div className={styles.uploadWrapper}>
                        <div className={styles.uploadFileWrapper} style={{ border: error.uploadFile ? '1px solid red' : '' }}>
                            <input className={styles.fileName} value={fileName} disabled />
                            <label className={styles.upload}>
                                <input type="file" onChange={(e) => onFileChange(e)} accept='video/mp4' multiple />
                                <UploadIcon />
                            </label>
                        </div>
                    </div>
                    <div className={styles.radioButtonWrapper} onChange={(e) => videoTypeSelected(e)}>
                        <label style={{ marginRight: '0.5em' }}>Video:</label>
                        <div className={styles.radioItem}>
                            <input type='radio' id={CONSTANTS.VIDEO_TYPE.MP4} name="videoType" value={CONSTANTS.VIDEO_TYPE.MP4} checked={videoType === CONSTANTS.VIDEO_TYPE.MP4} />
                            <label className={styles.radioLabel} htmlFor={CONSTANTS.VIDEO_TYPE.MP4}>MP4</label>
                        </div>
                        <div className={styles.radioItem}>
                            <input type='radio' id={CONSTANTS.VIDEO_TYPE.HLS} name="videoType" value={CONSTANTS.VIDEO_TYPE.HLS} checked={videoType === CONSTANTS.VIDEO_TYPE.HLS} />
                            <label className={styles.radioLabel} htmlFor={CONSTANTS.VIDEO_TYPE.HLS}>HLS</label>
                        </div>
                    </div>
                    {/* {videoTitleInputBox()} */}
                    {propertyDropdown()}
                    {templateDropdown()}
                </div>
                <div style={{ marginTop: '2em' }}>
                    <Table
                        data={chooseFromLastRecordData}
                        headerData={['Sr. No.', 'File Name', 'Video Title']}
                        showVideoPreview
                        onPreviewClick={onPreviewClick}
                        showVideoTitleInput
                        onTitleChange={onTitleChange}
                        wrapCol
                        columnToWrap={[1]}
                        generateSrNo
                    />
                </div>
            </>
        );
    };

    const onPreviewClick = (index: any) => {
        setUploadFile(s3FileUrlData[index].url);
        setVideoPreviewModal((state) => !state);
    };


    const fromS3UploadForm = () => {
        return (
            <>
                <div className={styles.s3UploadContainer}>
                    {propertyDropdown()}
                    <div>
                        <div className={styles.selectFromS3Wrapper}>
                            <Select
                                isMulti
                                closeMenuOnSelect={false}
                                className={styles.s3SelectStyle}
                                onChange={onS3FileChange}
                                value={s3FileUrl}
                                placeholder="Select From S3"
                                options={s3FileUrlData}
                                components={{ Option }}
                            />
                        </div>
                        {error.s3FileUrl && <small className={styles.errorMessage}>Please select minimum 1 or maximum 30 s3 files</small>}
                    </div>
                    {templateDropdown()}
                </div>
                <div style={{ marginTop: '2em' }}>
                    <Table
                        data={chooseFromLastRecordData}
                        headerData={s3TableHeader}
                        showVideoPreview
                        onPreviewClick={onPreviewClick}
                        showVideoDownloadIcon
                        showVideoTitleInput
                        onTitleChange={onTitleChange}
                    />
                </div>
            </>
        );
    };

    const onCheckboxChange = (rowId: any) => {
        const aa = [...s3FileUrl];
        if (!s3FileUrl.includes(s3FileUrlData[rowId])) {
            aa.push(s3FileUrlData[rowId]);
            setS3FileUrl(aa);
        } else {
            const data = aa.filter((x: any) => x.id !== s3FileUrlData[rowId].id);
            setS3FileUrl(data);
        }
        // setS3FileUrl(s3FileUrlData[rowId]);
        // !videoTitle && setVideoTitle(s3FileUrlData[rowId].label.split(' ')[0]);
    };

    // useEffect(()=>{
    //     console.table('s3FileUrl',s3FileUrl);
    // },[s3FileUrl]);

    const onTitleChange = (e: any, id: any) => {
        const aa = [...chooseFromLastRecordData];
        aa[id].videoTitle = e.target.value;
        setChooseFromLastRecordData(aa);
    };

    const chooseFromLastRecordFrom = () => {
        return (
            <>
                <div className={styles.lastRecordContainer}>
                    {/* {videoTitleInputBox()} */}
                    {propertyDropdown()}
                    {templateDropdown()}
                </div>
                <div style={{ marginTop: '2em' }}>
                    {/* {chooseFromLastRecordData.length > 0 && ( */}
                    <Table
                        data={chooseFromLastRecordData}
                        headerData={s3TableHeader}
                        onCheckboxChange={onCheckboxChange}
                        showCheckboxButton
                        showVideoPreview
                        onPreviewClick={onPreviewClick}
                        showVideoDownloadIcon
                        showVideoTitleInput
                        onTitleChange={onTitleChange}
                    />
                    {/* )} */}
                    {error.s3FileUrl && <small className={styles.errorMessage}>Please select minimum 1 or maximum 30 s3 files</small>}
                </div>
            </>
        );
    };

    const getTwoDigit = (x: number) => (x.toString().length < 2) ? '0' + x : x.toString();

    const formatTime = (x: number) => {
        const result: any = moment.duration(x, 'seconds');
        const ms = getTwoDigit(Math.floor(result._data.milliseconds));
        const newMs = ms.length > 2 ? ms.slice(0, -1) : ms;
        const formatedTime = getTwoDigit(result._data.hours) + ':' + getTwoDigit(result._data.minutes) + ':' + getTwoDigit(result._data.seconds) + ':' + newMs;
        return formatedTime;
    };

    const getDuration = async (data: any, _chooseFromLastRecordData: any, _s3FileUrlData: any) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            const videoDuration = video.duration;
            const formatedTime = formatTime(videoDuration);
            // setDuration(formatedTime);
            setChooseFromLastRecordData((prev) => [...prev, _chooseFromLastRecordData]);
            setS3FileUrlData((prev) => [...prev, { ..._s3FileUrlData, duration: formatedTime }]);
            return formatedTime;
        };
        video.src = URL.createObjectURL(data);
    };

    const onFileChange = async (event: any) => {
        setS3FileUrlData([]);
        setChooseFromLastRecordData([]);
        const files = event.target.files && Array.from(event.target.files);
        if (files && (files.length < 1 || files.length > 30)) {
            setPopupMessage({ show: true, msg: 'Please select minimum 1 or maximum 30 .mp4 file' });
        } else if (files && files.every((x: any) => x.type === 'video/mp4')) {
            for (let i = 0; i < files.length; i++) {
                const _fileName = files[i].name.substring(0, files[i].name.lastIndexOf('.'));
                await getDuration(
                    files[i],
                    {
                        id: i + 1,
                        fileName: files[i].name,
                        videoTitle: _fileName,
                    },
                    {
                        id: i + 1,
                        url: files[i],
                        file: files[i],
                        fileName: files[i].name,
                        fileSize: `${(files[i]?.size / 1000 / 1000).toFixed(2)} MB`,
                    }
                );
            }
        } else {
            setPopupMessage({ show: true, msg: 'Please select valid .mp4 file' });
        }

        setError({
            ...error,
            uploadFile: files === undefined || files[0] === undefined,
        });
    };

    const isValid = () => {
        //  && videoTitle !== '' && template
        if (uploadMethod === CONSTANTS.UPLOAD_METHOD.FROM_COMPUTER && s3FileUrlData && s3FileUrlData.length > 0 && s3FileUrlData.length <= 30 && videoType !== '' && property) {
            return true;
        }
        if ((uploadMethod === CONSTANTS.UPLOAD_METHOD.FROM_S3_UPLOAD || uploadMethod === CONSTANTS.UPLOAD_METHOD.CHOOSE_FROM_LAST_RECORD)
            && s3FileUrl && s3FileUrl.length > 0 && s3FileUrl.length <= 30 && property) {
            return true;
        }
        return false;
    };

    const onUploadAndContinueClick = () => {
        uploadMethod === CONSTANTS.UPLOAD_METHOD.FROM_COMPUTER && uploadFromComputer();
        (uploadMethod === CONSTANTS.UPLOAD_METHOD.FROM_S3_UPLOAD || uploadMethod === CONSTANTS.UPLOAD_METHOD.CHOOSE_FROM_LAST_RECORD) && uploadFroms3();
    };

    const uploadFroms3 = async () => {
        if (isValid()) {
            setLoading(true);
            setTotalCount(s3FileUrl.length);
            for await (const file of s3FileUrl) {
                setCurrentCount((count) => count + 1);
                setPercentDone(10);
                const _videoTitle = chooseFromLastRecordData.filter(x => x.rawUrl === file.url)[0]?.videoTitle ?? '';
                setFileName(_videoTitle || file.rawFileName);
                setUploadFileSize(file.fileSize || '');
                setShowUploadProgress(true);
                const bodyParam = {
                    content_id: file.value,
                    status: 'Uploaded',
                };

                const updateS3File = await s3FileUrlUpdate(bodyParam);
                setPercentDone(50);
                if (updateS3File.status === 200) {
                    const responseData = updateS3File.data;
                    if (responseData) {
                        const saveVideoParams: TStandardObject = {
                            content_id: file.value,
                            type: videoType,
                            // property_name : property ? property['value'] : '',
                        };
                        if (!isEmpty(_videoTitle)) saveVideoParams.content_name = _videoTitle;
                        if (!isEmpty(template)) saveVideoParams.template = {
                            template_name: template['value'],
                            property_name: template['propertyName'],
                            start_bumper: template['startBumper'],
                            end_bumper: template['endBumper'],
                        };
                        await saveVideoData(saveVideoParams);
                        setPercentDone(100);
                    }
                } else {
                    setPercentDone(100);
                    // setShowUploadProgress(false);
                    // setLoading(false);
                }
            }
            setShowUploadProgress(false);
            setLoading(false);
            clearAllFields();
            setPopupMessage({ show: true, msg: 'Files Uploaded Successfully.' });


        } else {
            // clearInterval(aa._id);
            setPercentDone(100);
            setShowUploadProgress(false);
            setError({
                ...error,
                // videoTitle: isEmpty(videoTitle),
                s3FileUrl: s3FileUrl.length < 1 || s3FileUrl.length > 30,
                property: isEmpty(property),
                // template: isEmpty(template),
            });
        }
    };

    const uploadFromComputer = async () => {
        if (isValid()) {
            setLoading(true);
            setTotalCount(s3FileUrlData.length);
            setShowUploadProgress(true);
            for await (const x of s3FileUrlData) {
                setCurrentCount((count) => count + 1);
                setPercentDone(5);
                setFileName(x.fileName);
                setUploadFileSize(x.fileSize);
                if (x.file && property) {
                    const param = {
                        original_file_name: x.fileName,
                        content_type: x.file.type,
                        property_name: property['value'],
                        type: 'upload_from_computer',
                    };
                    const response = await getUploadID(param);
                    setPercentDone(10);
                    if (response.status === 200) {
                        const responseData = response.data;
                        if (responseData) {
                            const uploadParams = {
                                bucket_name: responseData.bucket,
                                raw_file_name: responseData.raw_file_name,
                                file_name: responseData.file_name,
                                upload_id: responseData.upload_id,
                            };
                            await uploadMultipartFile(uploadParams, x);
                            setPercentDone(100);
                            // setShowUploadProgress(false);
                            // setLoading(false);
                        }
                    } else {
                        console.log('error :>> ', response.error);
                        setPercentDone(100);
                        // setShowUploadProgress(false);
                        // setLoading(false);
                    }
                }
            }
            setShowUploadProgress(false);
            setLoading(false);
            clearAllFields();
            setPopupMessage({ show: true, msg: 'Files Uploaded Successfully.' });



        } else {
            // clearInterval(aa._id);
            setPercentDone(100);
            setShowUploadProgress(false);
            setError({
                ...error,
                // videoTitle: isEmpty(videoTitle),
                videoType: isEmpty(videoType),
                property: isEmpty(property),
                // template: isEmpty(template),
                uploadFile: s3FileUrlData && (s3FileUrlData.length > 30 || s3FileUrlData.length <= 0),
            });
        }
    };

    const uploadMultipartFile = async (uploadParams: any, x: any) => {
        try {
            const CHUNK_SIZE = 10000000; // 10MB
            const fileSize = x.file?.size ?? 0;
            const CHUNKS_COUNT = Math.floor(fileSize / CHUNK_SIZE) + 1;
            const promisesArray = [];
            let start, end, blob;

            for (let index = 1; index < CHUNKS_COUNT + 1; index++) {
                start = (index - 1) * CHUNK_SIZE;
                end = (index) * CHUNK_SIZE;
                blob = (index < CHUNKS_COUNT) ? x.file?.slice(start, end) : x.file?.slice(start);

                const queryParams = {
                    bucket_name: uploadParams.bucket_name,
                    raw_file_name: uploadParams.raw_file_name,
                    part_number: index,
                    upload_id: uploadParams.upload_id,
                    file_name: uploadParams.file_name,
                };

                // Get presigned URL for each part
                const response = await getSignedUrl(queryParams);
                setPercentDone((data) => data + ((70 / CHUNKS_COUNT + 1) / 2));
                if (response.status === 200) {
                    const responseData = response.data;
                    const presignedUrl = responseData;
                    // console.log('   Presigned URL ' + index + ': ' + presignedUrl + ' filetype ' + uploadFile?.type);
                    // Send part aws server
                    const uploadResp = axios.put(presignedUrl, blob, {
                        headers: { 'Content-Type': x.file?.type }
                    }).then((x) => {
                        setPercentDone((data) => data + ((70 / CHUNKS_COUNT + 1) / 2));
                        return x;
                    });
                    promisesArray.push(uploadResp);
                } else {
                    console.log('error :>> ', response.error);
                }
            }

            const resolvedArray = await Promise.all(promisesArray);

            const uploadPartsArray: Array<{ [key: string]: any }> = [];
            resolvedArray.forEach((resolvedPromise, index) => {
                uploadPartsArray.push({
                    ETag: resolvedPromise.headers.etag,
                    PartNumber: index + 1
                });
            });

            // CompleteMultipartUpload in the backend server
            const params = {
                bucket_name: uploadParams.bucket_name,
                file_name: uploadParams.file_name,
                raw_file_name: uploadParams.raw_file_name,
                upload_id: uploadParams.upload_id,
                parts: uploadPartsArray,
            };
            const completeUploadResp = await completeMultipartUpload(params);
            setPercentDone((data) => data + 10);
            const { content_id } = completeUploadResp.data;
            if (completeUploadResp.data) {
                const saveVideoParams: TStandardObject = {
                    content_id,
                    type: videoType,
                    property_name: {
                        name: property ? property['value'] : '',
                        id: property ? property['id'] : '',
                    },
                    content_duration: x.duration,
                };
                const _videoTitle = chooseFromLastRecordData.filter(y => y.id === x.id)[0]?.videoTitle ?? '';
                if (!isEmpty(_videoTitle)) saveVideoParams.content_name = _videoTitle;
                if (!isEmpty(template)) saveVideoParams.template = {
                    template_name: template['value'],
                    property_name: template['propertyName'],
                    start_bumper: template['startBumper'],
                    end_bumper: template['endBumper'],
                };
                const saveVideoResponse = await saveVideoData(saveVideoParams);
                setPercentDone((data) => data + 10);
                if (saveVideoResponse.status === 200) {
                    // 
                } else {
                    console.log('error', completeUploadResp.error);
                }
            }

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.headingStyle}>Select Upload Method</div>
            <div className={styles.radioButtonWrapper} onChange={(e) => uploadMethodSelected(e)}>
                <div className={styles.radioItem}>
                    <input type='radio' id={CONSTANTS.UPLOAD_METHOD.FROM_COMPUTER} name="uploadMethod" value={CONSTANTS.UPLOAD_METHOD.FROM_COMPUTER} checked={uploadMethod === CONSTANTS.UPLOAD_METHOD.FROM_COMPUTER} />
                    <label className={styles.radioLabel} htmlFor={CONSTANTS.UPLOAD_METHOD.FROM_COMPUTER}>From Computer</label>
                </div>
                <div className={styles.radioItem}>
                    <input type='radio' id={CONSTANTS.UPLOAD_METHOD.FROM_S3_UPLOAD} name="uploadMethod" value={CONSTANTS.UPLOAD_METHOD.FROM_S3_UPLOAD} checked={uploadMethod === CONSTANTS.UPLOAD_METHOD.FROM_S3_UPLOAD} />
                    <label className={styles.radioLabel} htmlFor={CONSTANTS.UPLOAD_METHOD.FROM_S3_UPLOAD}>All Videos (S3)</label>
                </div>
                <div className={styles.radioItem}>
                    <input type='radio' id={CONSTANTS.UPLOAD_METHOD.CHOOSE_FROM_LAST_RECORD} name="uploadMethod" value={CONSTANTS.UPLOAD_METHOD.CHOOSE_FROM_LAST_RECORD} checked={uploadMethod === CONSTANTS.UPLOAD_METHOD.CHOOSE_FROM_LAST_RECORD} />
                    <label className={styles.radioLabel} htmlFor={CONSTANTS.UPLOAD_METHOD.CHOOSE_FROM_LAST_RECORD}>Recent Videos (S3)</label>
                </div>
            </div>

            {uploadMethod === CONSTANTS.UPLOAD_METHOD.FROM_COMPUTER && fromComputerForm()}
            {uploadMethod === CONSTANTS.UPLOAD_METHOD.FROM_S3_UPLOAD && fromS3UploadForm()}
            {uploadMethod === CONSTANTS.UPLOAD_METHOD.CHOOSE_FROM_LAST_RECORD && chooseFromLastRecordFrom()}

            <Button
                id="uploadAndContinue"
                buttonType="primary"
                styleClass={styles.uploadAndContinue}
                onClick={onUploadAndContinueClick}
                showLoader={loading}
                disabled={loading}
            >
                Upload
            </Button>

            {/* <VideoValidationNote /> */}

            {videoPreviewModal && (
                <VideoPreviewModal
                    fileName={fileName}
                    videoSrc={uploadFile || ''}
                    onCloseClick={() => setVideoPreviewModal((state) => !state)}
                    uploadedFromComputer={uploadMethod === CONSTANTS.UPLOAD_METHOD.FROM_COMPUTER}
                />
            )}

            {showUploadProgress && (
                <div className={styles.progressModal}>
                    <div className={styles.progressModalBody}>
                        <div className={styles.progressModalContent}>
                            <div className={styles.fileName}>{fileName}</div>
                            <div className={styles.fileSize}>{uploadFileSize}</div>
                            <div>{currentCount}/{totalCount}</div>
                            <label className={styles.uploadDuration}>{/* 2 Minutes remaining */} <span className={styles.percentDone}>{percentDone >= 100 ? 100 : percentDone.toFixed(0)}%</span></label>

                            {/* <Button id="closeProgressModalBtn" onClick={() => setShowUploadProgress((state) => !state)}>
                                    <CloseIcon />
                                </Button> */}
                        </div>
                        <div className={styles.progressBar} style={{ width: `${percentDone}%` }} />
                    </div>
                </div>
            )}

            {popupMessage.show && (
                <MessagePopup message={popupMessage.msg} onCloseClick={() => setPopupMessage({ show: false, msg: '' })} />
            )}

        </div>
    );
};

export default SelectBulkVideo;
