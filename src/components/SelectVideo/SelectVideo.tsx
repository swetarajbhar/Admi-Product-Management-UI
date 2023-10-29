import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { s3FileUrlList } from '../../api/s3FileUrl';
import { getPresignedUrl, transcribecontent } from '../../api/s3MultipartUpload';
import { ReactComponent as CloseIcon } from '../../assets/SVG/closeIcon.svg';
import { ReactComponent as UploadIcon } from '../../assets/SVG/uploadIcon.svg';
import CONSTANTS from '../../constants/constants';
import DATE_FORMAT from '../../constants/DATE_FORMAT';
import TAPIResponse from '../../types/APIResponse';
import isEmpty from '../../utils/isEmpty';
import Button from '../Button/Button';
import Entry from '../Entry/Entry';
import MessagePopup from '../MessagePopup/MessagePopup';
import VideoPreviewModal from '../VideoPreviewModal/VideoPreviewModal';
import styles from './SelectVideo.module.scss';
import { VIDEO_LIBRARY_LISTING } from '../../utils/routes';
import { useHistory } from 'react-router-dom';
import { getContentDetails } from '../../api/videoDetail';

interface SelectVideoProps {
    propertyData?: any;
    templateData?: any;
    onRedirect?: (type: string, payload?: { [key: string]: any }) => void
    updateContentId: (contentID: string) => void
}

let checkTranscriptionStatus: any;

const SelectVideo = ({ onRedirect, updateContentId }: SelectVideoProps): JSX.Element => {

    const [uploadMethod, setUploadMethod] = useState(CONSTANTS.UPLOAD_METHOD.FROM_COMPUTER);
    const [videoType, setVideoType] = useState(CONSTANTS.VIDEO_TYPE.MP4);
    const [videoTitle, setVideoTitle] = useState('');
    const [fileName, setFileName] = useState('');
    const [uploadFile, setUploadFile] = useState<File | any>();
    const [showUploadProgress, setShowUploadProgress] = useState(false);
    const [videoPreviewModal, setVideoPreviewModal] = useState(false);
    const [percentDone, setPercentDone] = useState(0);
    const [popupMessage, setPopupMessage] = useState({ show: false, msg: '', redirect: false });
    const [loading, setLoading] = useState(false);
    const [duration, setDuration] = useState('');
    const [transcribeJobName, setTranscribeJobName] = useState('');
    const [error, setError] = useState({
        videoTitle: false,
        videoType: false,
        uploadFile: false,
        transcribeJobName: false
    });

    const history = useHistory();

    useEffect(() => {
        return () => checkTranscriptionStatus && clearInterval(checkTranscriptionStatus);
    }, []);

    const uploadMethodSelected = (e: any) => {
        setUploadMethod(e.target.value);
        setUploadFile(undefined);
        setFileName('');
        setVideoTitle('');
        setError({
            videoTitle: false,
            videoType: false,
            uploadFile: false,
            transcribeJobName: false
        });
    };

    const videoTypeSelected = (e: any) => {
        setVideoType(e.target.value);
    };

    

    const onVideoTitleChange = (e: any) => {
        setVideoTitle(e.target.value);
        setError({
            ...error,
            videoTitle: isEmpty(e.target.value)
        });
    };

    const onTranscribeJobNameChange = (e: any) => {
        const value = e.target?.value?.replace(/\s/g, '') ?? '';
        setTranscribeJobName(value);
        setError({
            ...error,
            transcribeJobName: isEmpty(value)
        });
    };

    const videoTitleInputBox = () => {
        return (
            <div>
                <Entry
                    id='videoTitle'
                    name='videoTitle'
                    type='text'
                    styleClass={styles.inputStyle}
                    placeholder='Video Title'
                    value={videoTitle}
                    onChange={onVideoTitleChange}
                />
                {error.videoTitle && <small className={styles.errorMessage}>Please enter video title</small>}
            </div>
        );
    };


    const fromComputerForm = () => {
        return (
            <div className={styles.computerUploadContainer}>
                <div className={styles.uploadWrapper}>
                    <div className={styles.uploadFileWrapper} style={{ border: error.uploadFile ? '1px solid red' : '' }}>
                        <input className={styles.fileName} value={fileName} disabled />
                        <label className={styles.upload}>
                            <input type="file" onChange={(e) => onFileChange(e)} accept='video/mp4' />
                            <UploadIcon />
                        </label>
                    </div>
                    <Button id="preview" buttonType="secondary" styleClass={styles.previewBtnStyle} onClick={() => setVideoPreviewModal((state) => !state)}>
                        Preview
                    </Button>
                </div>
                <div className={styles.radioButtonWrapper} onChange={(e) => videoTypeSelected(e)}>
                    <label style={{ marginRight: '0.5em' }}>Video:</label>
                    <div className={styles.radioItem}>
                        <input type='radio' id={CONSTANTS.VIDEO_TYPE.MP4} name="videoType" value={CONSTANTS.VIDEO_TYPE.MP4} checked={videoType === CONSTANTS.VIDEO_TYPE.MP4} />
                        <label className={styles.radioLabel} htmlFor={CONSTANTS.VIDEO_TYPE.MP4}>MP4</label>
                    </div>
                    {/* <div className={styles.radioItem}>
                        <input type='radio' id={CONSTANTS.VIDEO_TYPE.HLS} name="videoType" value={CONSTANTS.VIDEO_TYPE.HLS} checked={videoType === CONSTANTS.VIDEO_TYPE.HLS} />
                        <label className={styles.radioLabel} htmlFor={CONSTANTS.VIDEO_TYPE.HLS}>HLS</label>
                    </div> */}
                </div>
                {videoTitleInputBox()}
                <div>
                    <Entry
                        id='transcribeJobName'
                        name='transcribeJobName'
                        type='text'
                        styleClass={styles.inputStyle}
                        placeholder='Transcription Job Name'
                        value={transcribeJobName}
                        onChange={onTranscribeJobNameChange}
                    />
                    {error.transcribeJobName && <small className={styles.errorMessage}>Please enter Transcription job name</small>}
                </div>
                {/* {propertyDropdown()}
                {templateDropdown()} */}
            </div>
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

    const onFileChange = async (event: any) => {
        const file = event.target.files[0];
        if (file && file.type === 'video/mp4') {
            !videoTitle && setVideoTitle(file.name.substring(0, file.name.lastIndexOf('.')));

            setFileName(file.name);
            setUploadFile(file);

            // myVideos.push(files[0]);
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = function () {
                window.URL.revokeObjectURL(video.src);
                const videoDuration = video.duration;
                const formatedTime = formatTime(videoDuration);
                setDuration(formatedTime);
            };
            video.src = URL.createObjectURL(file);
        } else {
            setPopupMessage({ show: true, msg: 'Please select valid .mp4 file', redirect: false });
        }
        setError({
            ...error,
            uploadFile: file === undefined,
        });
    };

    const isValid = () => {
        if (uploadMethod === CONSTANTS.UPLOAD_METHOD.FROM_COMPUTER && uploadFile && videoType !== '' && !isEmpty(videoTitle) && !isEmpty(transcribeJobName)) {
            return true;
        }
        return false;
    };

    const onUploadAndContinueClick = () => {
        uploadMethod === CONSTANTS.UPLOAD_METHOD.FROM_COMPUTER && uploadFromComputer();
        // (uploadMethod === CONSTANTS.UPLOAD_METHOD.FROM_S3_UPLOAD || uploadMethod === CONSTANTS.UPLOAD_METHOD.CHOOSE_FROM_LAST_RECORD) && uploadFroms3();
    };

    const uploadFromComputer = async () => {
        if (isValid()) {
            setLoading(true);
            setShowUploadProgress(true);
            if (uploadFile) {
                startPresignedUrlUpload();
            }
        } else {
            // clearInterval(aa._id);
            setPercentDone(100);
            setShowUploadProgress(false);
            setError({
                ...error,
                videoTitle: isEmpty(videoTitle),
                videoType: isEmpty(videoType),
                // property: isEmpty(property),
                // template: isEmpty(template),
                uploadFile: uploadFile === undefined,
                transcribeJobName: isEmpty(transcribeJobName)
            });
        }
    };

    const startPresignedUrlUpload = async () => {
        const payload = {
            fileName: fileName,
            contentType: uploadFile.type,
            contentName: videoTitle,
            originalFileName: fileName,
        };
        const res = await getPresignedUrl(payload);
        if (res.status === 200) {
            const { contentId, presignedUrl } = res.data;
            const uploadResp = await uploadVideoFile(presignedUrl);
            if (uploadResp?.status === 200) {
                // const date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                transcribeContent(contentId);
            } else {
                setPopupMessage({ show: true, msg: 'Some error occurred. Please try again later.', redirect: true });
            }
        } else {
            setPopupMessage({ show: true, msg: 'Some error occurred. Please try again later.', redirect: true });
        }
    };

    const uploadVideoFile = async (url: string): Promise<TAPIResponse> => {
        const config = {
            onUploadProgress: (progressEvent: any) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                if (percentCompleted < 100) setPercentDone(percentCompleted);
            }
        };
        return await axios
            .put(url, uploadFile, config)
            .then(res => {
                if (res.status === 200) {
                    return res;
                }
            })
            .catch(err => {
                console.log('err :>> ', err);
                return err;
            });
    };

    const getVideoData = async (contentId: string) => {
        const params = {
            limit: 1,
            offset: 0
        };
        getContentDetails(contentId, params)
            .then((res) => {
                if (res) {
                    if (res.transcription_status === CONSTANTS.STATUS.COMPLETED) {
                        updateContentId(contentId);
                        clearInterval(checkTranscriptionStatus);

                        // redirect to next step
                        onRedirect && onRedirect('next', {
                            ...res
                        });
                    }
                }
            })
            .catch((err) => {
                console.log('err :>> ', err);
            });
    };

    const transcribeContent = async (contentId: string) => {
        const payload = {
            contentId,
            transcriptionJobName: transcribeJobName
        };
        const res = await transcribecontent(payload);
        if (res.status === 200) {
            setPopupMessage({ show: true, msg: 'Video uploaded successfully. Please wait for transcription to complete.', redirect: false });
            setPercentDone(100);
            setShowUploadProgress(false);

            // set time out and resirect to next step on status complete
            checkTranscriptionStatus = setInterval(() => {
                getVideoData(contentId);
            }, 1000 * 30);
        } else {
            if (res.status === 400) {
                setPopupMessage({
                    show: true,
                    msg: 'Please rename the transcript and try uploading the video again.',
                    redirect: true
                });
            } else {
                setPopupMessage({ show: true, msg: 'Some error occurred. Please try again.', redirect: true });
            }
            setLoading(false);
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
                {/* <div className={styles.radioItem}>
                    <input type='radio' id={CONSTANTS.UPLOAD_METHOD.FROM_S3_UPLOAD} name="uploadMethod" value={CONSTANTS.UPLOAD_METHOD.FROM_S3_UPLOAD} checked={uploadMethod === CONSTANTS.UPLOAD_METHOD.FROM_S3_UPLOAD} />
                    <label className={styles.radioLabel} htmlFor={CONSTANTS.UPLOAD_METHOD.FROM_S3_UPLOAD}>All Videos (S3)</label>
                </div>
                <div className={styles.radioItem}>
                    <input type='radio' id={CONSTANTS.UPLOAD_METHOD.CHOOSE_FROM_LAST_RECORD} name="uploadMethod" value={CONSTANTS.UPLOAD_METHOD.CHOOSE_FROM_LAST_RECORD} checked={uploadMethod === CONSTANTS.UPLOAD_METHOD.CHOOSE_FROM_LAST_RECORD} />
                    <label className={styles.radioLabel} htmlFor={CONSTANTS.UPLOAD_METHOD.CHOOSE_FROM_LAST_RECORD}>Recent Videos (S3)</label>
                </div> */}
            </div>

            {uploadMethod === CONSTANTS.UPLOAD_METHOD.FROM_COMPUTER && fromComputerForm()}
            {/* {uploadMethod === CONSTANTS.UPLOAD_METHOD.FROM_S3_UPLOAD && fromS3UploadForm()}
            {uploadMethod === CONSTANTS.UPLOAD_METHOD.CHOOSE_FROM_LAST_RECORD && chooseFromLastRecordFrom()} */}

            <Button
                id="uploadAndContinue"
                buttonType="primary"
                styleClass={styles.uploadAndContinue}
                onClick={onUploadAndContinueClick}
                showLoader={loading}
                disabled={loading}
            >
                Upload &amp; Continue
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
                            <div className={styles.fileSize}>
                                {(uploadFile?.size / 1000 / 1000).toFixed(2)} MB
                            </div>
                            <label className={styles.uploadDuration}><span className={styles.percentDone}>{percentDone >= 100 ? 100 : percentDone.toFixed(0)}%</span></label>
                            <Button id="closeProgressModalBtn" onClick={() => setShowUploadProgress((state) => !state)}>
                                <CloseIcon />
                            </Button>
                        </div>
                        <div className={styles.progressBar} style={{ width: `${percentDone}%` }} />
                    </div>
                </div>
            )}

            {popupMessage.show && (
                <MessagePopup
                    message={popupMessage.msg}
                    onCloseClick={() => popupMessage.redirect ? history.push(VIDEO_LIBRARY_LISTING) : setPopupMessage({ ...popupMessage, show: false })}
                    buttonText={popupMessage.redirect ? 'Ok' : 'Close'}
                />
            )}

        </div>
    );
};

export default SelectVideo;
