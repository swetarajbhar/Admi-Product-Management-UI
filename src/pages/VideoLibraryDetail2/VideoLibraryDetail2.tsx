import axios from 'axios';
import cx from 'classnames';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';
import { completeMultipartUpload, getSignedUrl, getUploadID } from '../../api/s3MultipartUpload';
import { videoLibraryDeleteSection, videoLibraryGetScreenshots } from '../../api/videoLibrary';
import { ReactComponent as ArrowBackIcon } from '../../assets/SVG/arrowBack.svg';
import { ReactComponent as LoaderIcon } from '../../assets/SVG/loader.svg';
import { ReactComponent as ArrowForwardIcon } from '../../assets/SVG/arrowForward.svg';
import { ReactComponent as PauseIcon } from '../../assets/SVG/pause.svg';
import { ReactComponent as PlayButtonIcon } from '../../assets/SVG/playButton.svg';
import { ReactComponent as CheckedRadioIcon } from '../../assets/SVG/radioButtonChecked.svg';
import { ReactComponent as UnCheckedRadioIcon } from '../../assets/SVG/radioButtonUnchecked.svg';
import { ReactComponent as RedoIcon } from '../../assets/SVG/redo.svg';
import { ReactComponent as TrashIcon } from '../../assets/SVG/trash.svg';
import { ReactComponent as UndoIcon } from '../../assets/SVG/undo.svg';
import Bumper from '../../components/Bumper/Bumper';
import Button from '../../components/Button/Button';
import Section from '../../components/Section/Section';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import TStandardObject from '../../types/StandardObject';
import isEmpty from '../../utils/isEmpty';
import styles from './VideoLibraryDetail2.module.scss';
import { isInteger } from '../../utils/regexCheck';
import MessagePopup from '../../components/MessagePopup/MessagePopup';
import moment from 'moment';
import { updateS3VideoStatus } from '../../api/videoDetail';

type TObject = {
    [key: string]: number
};

type TVideoLibraryDetail2Props = {
    headBumper: string;
    video: string;
    endBumper: string;
    propertyName: string;
    onRedirect: (type: string) => void;
    contentId: string;
    contentDuration: string;
    s3FileContentId: string;
    hideBackButton: boolean;
    uploadedFromComputer: boolean;
}

interface IActions {
    name: 'DELETE',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
}

interface IThumbnails {
    id: number,
    src: string,
    show: boolean
}

const scrolledOffImages: TObject = {};
const scrolledOffImagesCount = 0.00;
let deletedSections: TObject = {};
let __videoSources: Array<string> = [];
let activeVideo: 'head' | 'end' | 'full' = 'full';
const bumperFiles: Array<File | null> = [];

const VideoLibraryDetail2 = ({
    headBumper, video, endBumper, propertyName, contentId, onRedirect, contentDuration, s3FileContentId, hideBackButton, uploadedFromComputer
}: TVideoLibraryDetail2Props): JSX.Element => {

    const [playing, setPlaying] = useState(false);
    const [thumbnails, setThumbnails] = useState<Array<IThumbnails>>([]);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(1);
    const [currentBumperName, setCurrentBumperName] = useState<'head' | 'end' | ''>('head');
    const [videoSources, setVideoSources] = useState<Array<string>>([headBumper, video, endBumper]);
    const [videoPlayerOptions, setVideoPlayerOptions] = useState<VideoJsPlayerOptions>({
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
            src: headBumper || video,
            type: 'video/mp4',
        }],
        height: 500,
        width: 650,
    });
    const [actionStack, setActionStack] = useState<Array<IActions>>([]);
    const [undoStack, setUndoStack] = useState<Array<IActions>>([]);
    const [redoStack, setRedoStack] = useState<Array<IActions>>([]);
    const [allThumbnails, setAllThumbnails] = useState<Array<Array<IThumbnails>>>([]);
    const [currentThumbnailSection, setCurrentThumbnailSection] = useState(0);

    const playerRef = useRef<VideoJsPlayer | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileUploadref = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ show: false, msg: '' });
    const [endDuration, setEndDuration] = useState('');

    useEffect(() => {
        if (contentDuration) setEndDuration(contentDuration);
    }, [contentDuration]);

    // const onIntersection = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    //     const [{ target, intersectionRatio }] = entries;
    //     const imgIndex = parseInt(target.id.split('---')[1], 10);
    //     // console.log('imgIndex', imgIndex);
    //     if (Object.keys(scrolledOffImages).includes(`${imgIndex}`) || isEmpty(Object.keys(scrolledOffImages).length)) {
    //         // const activeThumbnails = thumbnails.filter(x => x.show);
    //         // const _scrolledOffImagesCount = parseFloat(activeThumbnails.filter(x => x.id < imgIndex).length.toPrecision(3)) + (1 - intersectionRatio);
    //         // const _scrolledOffImagesCount = /* parseFloat(activeThumbnails.filter(x => x.id < imgIndex).length.toPrecision(3)) +  */(1 - intersectionRatio);
    //         scrolledOffImages[imgIndex] = (1 - intersectionRatio);
    //         if (scrolledOffImages[imgIndex] >= 1 && scrolledOffImages[imgIndex + 1] === undefined) {
    //             scrolledOffImages[imgIndex + 1] = 0;
    //         }
    //         if (scrolledOffImages[imgIndex] === 1 && scrolledOffImages[imgIndex + 2] === 0) {
    //             scrolledOffImages[imgIndex] = 0;
    //         }
    //         // console.log('intersectedIndices', scrolledOffImages);
    //     }
    // };

    // const imageObserver = new IntersectionObserver(onIntersection, {
    //     threshold: [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09,
    //         0.1, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19,
    //         0.2, 0.21, 0.22, 0.23, 0.24, 0.25, 0.26, 0.27, 0.28, 0.29,
    //         0.3, 0.31, 0.32, 0.33, 0.34, 0.35, 0.36, 0.37, 0.38, 0.39,
    //         0.4, 0.41, 0.42, 0.43, 0.44, 0.45, 0.46, 0.47, 0.48, 0.49,
    //         0.5, 0.51, 0.52, 0.53, 0.54, 0.55, 0.56, 0.57, 0.58, 0.59,
    //         0.6, 0.61, 0.62, 0.63, 0.64, 0.65, 0.66, 0.67, 0.68, 0.69,
    //         0.7, 0.71, 0.72, 0.73, 0.74, 0.75, 0.76, 0.77, 0.78, 0.79,
    //         0.8, 0.81, 0.82, 0.83, 0.84, 0.85, 0.86, 0.87, 0.88, 0.89,
    //         0.9, 0.91, 0.92, 0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 0.99, 1],
    //     root: scrollRef.current,
    //     // rootMargin: '35px'
    // });

    useEffect(() => {
        __videoSources = [headBumper, video, endBumper];
        videoLibraryGetScreenshots(video)
            .then((res) => {
                // setVideoPlayerOptions((data) => ({ ...data, sources: [{ src: headBumper, type: 'video/mp4' }] }));
                setAllThumbnails(res?.data);
                setThumbnails([...res?.data[0]]);
            });
    }, []);

    // useEffect(() => {
    //     if (isEmpty(imageObserver.takeRecords().length)) {
    //         document.querySelectorAll('#scroll > img')
    //             .forEach((element) => {
    //                 imageObserver.observe(element);
    //             });
    //     }
    //     return () => {
    //         document.querySelectorAll('#scroll > img')
    //             .forEach((element) => {
    //                 imageObserver.unobserve(element);
    //             });
    //     };
    // });

    useEffect(() => {
        if (!isEmpty(undoStack.length)) {
            const { data, name } = undoStack[undoStack.length - 1];
            if (name === 'DELETE') {
                const _images = [...thumbnails];
                for (let i = 0; i < _images.length; i++) {
                    if (i >= data.startTime && i <= data.endTime) {
                        _images[i].show = true;
                    }
                }
                delete deletedSections[data.startTime];
                setThumbnails(_images);
            }
        }
    }, [undoStack]);

    useEffect(() => {
        if (!isEmpty(redoStack.length)) {
            const { data, name } = redoStack[redoStack.length - 1];
            if (name === 'DELETE') {
                const _images = [...thumbnails];
                for (let i = 0; i < _images.length; i++) {
                    if (i >= data.startTime && i <= data.startTime) {
                        _images[i].show = false;
                    }
                }
                deletedSections[startTime] = endTime;
                setThumbnails(_images);
            }
        }
    }, [redoStack]);

    const handlePlayerReady = (player: VideoJsPlayer) => {
        playerRef.current = player;
        player.on('dispose', () => {
            console.log('player will dispose');
        });

        player.on('ready', () => {
            console.log('player is ready');
        });
    };

    const setCurrentTime = (player: VideoJsPlayer) => {
        const aa = Object.keys(deletedSections).find(x => parseFloat(x) < (player?.currentTime() || 0) && (player?.currentTime() || 0) <= deletedSections[x]);
        if (aa !== undefined) {
            player?.currentTime(deletedSections[aa] + 0.1);
        }
    };

    const onPlayingEvent = (player: VideoJsPlayer | null, videoRef: HTMLVideoElement | null) => {
        if (activeVideo === 'full') {
            if (videoRef?.src === video) {
                const aa = Object.keys(deletedSections).find(x => (parseFloat(x) < (videoRef?.currentTime || 0)) && ((videoRef?.currentTime || 0) <= deletedSections[x]));
                if (aa !== undefined && videoRef !== null) {
                    videoRef.currentTime = (deletedSections[aa] + 0.0001);
                }
            }
        }
    };

    const onPlaybackEnd = (player: VideoJsPlayer | null, videoRef: HTMLVideoElement | null) => {
        if (activeVideo === 'full') {
            const currentSource = videoRef?.src;
            const index = __videoSources.findIndex(x => x === currentSource);
            if (index !== __videoSources.length - 1 && __videoSources[index + 1]) {
                const _videoPlayerOptions = { ...videoPlayerOptions };
                _videoPlayerOptions.sources = [{ src: __videoSources[index + 1], type: 'video/mp4' }];
                setVideoPlayerOptions({ ..._videoPlayerOptions });
            }
        }
    };

    // const changePlayerOptions = () => {
    //   // you can update the player through the Video.js player instance
    //   if (!playerRef.current) {
    //     return;
    //   }
    //   // [update player through instance's api]
    //   playerRef.current.src([{src: 'http://ex.com/video.mp4', type: 'video/mp4'}]);
    //   playerRef.current.autoplay(false);
    // };

    const onPlayButtonClick = () => {
        if (playerRef.current?.paused()) {
            setCurrentTime(playerRef.current);
            playerRef.current?.play();
        } else {
            playerRef.current?.pause();
        }
        setPlaying(playerRef.current?.paused() ? false : true);
    };

    const onBumperChangeClick = (type: 'head' | 'end') => {
        setCurrentBumperName(type);
        fileUploadref.current?.click();
    };

    const onBumperSelectClick = (type: 'head' | 'end' | 'full') => {
        const index = type === 'head' || type === 'full' ? 0 : 2;
        if (__videoSources[index]) {
            const _videoPlayerOptions = { ...videoPlayerOptions };
            _videoPlayerOptions.sources = [{ src: __videoSources[index], type: 'video/mp4' }];
            activeVideo = type;
            setVideoPlayerOptions({ ..._videoPlayerOptions });
        }
    };

    const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const _videoSources = [...videoSources];
        let index: 0 | 2 = 0;
        if (e.target.files !== null) {
            const fileURL = URL.createObjectURL(e.target.files[0]);
            if (currentBumperName === 'head') {
                _videoSources[index] = fileURL;
                bumperFiles[0] = e.target.files[0];
            } else {
                _videoSources[2] = fileURL;
                index = 2;
                if (bumperFiles[0] === undefined) {
                    bumperFiles[0] = null;
                }
                bumperFiles[1] = e.target.files[0];
            }
        }
        const _videoPlayerOptions = { ...videoPlayerOptions };
        _videoPlayerOptions.sources = [{ src: _videoSources[index], type: 'video/mp4' }];
        __videoSources = [..._videoSources];
        setVideoPlayerOptions({ ..._videoPlayerOptions });
        setVideoSources(_videoSources);
        setCurrentBumperName('');
    };

    const onDeleteClick = () => {
        const _images = [...thumbnails];

        const inviImagesCount = _images.filter(x => !x.show).length;

        const startTimeWithOffset = startTime + inviImagesCount;
        const endTimeWithOffset = endTime + inviImagesCount;

        for (let i = 0; i < _images.length; i++) {
            if (i >= Math.floor(startTimeWithOffset) && i < Math.floor(endTimeWithOffset)) {
                _images[i].show = false;
            }
        }

        const skippedThumbnailSection = (currentThumbnailSection * 300);
        const deletedSectionsKey = skippedThumbnailSection + (startTimeWithOffset * 30);
        deletedSections[deletedSectionsKey] = skippedThumbnailSection + (endTimeWithOffset * 30);
        // console.log('deletedSections :>> ', deletedSections);
        const _actionStack = [...actionStack];
        _actionStack.push({
            name: 'DELETE',
            data: {
                startTime: deletedSectionsKey,
                endTime: deletedSections[deletedSectionsKey]
            }
        });

        const _allImages = [...allThumbnails];
        _allImages[currentThumbnailSection] = _images;

        setThumbnails(_images);
        setAllThumbnails([..._allImages]);
        setActionStack([..._actionStack]);
    };

    const onUndoClick = () => {
        const _undoStack = [...undoStack];
        const lastAction = actionStack[actionStack.length - 1];
        _undoStack.push(lastAction);

        const _actionStack = actionStack.slice(0, actionStack.length - 1);

        setUndoStack([..._undoStack]);
        setActionStack([..._actionStack]);
    };

    const onRedoClick = () => {
        const _redoStack = [...redoStack];
        const lastUndoAction = undoStack[undoStack.length - 1];
        _redoStack.push(lastUndoAction);

        // const _undoStack = undoStack.slice(0, undoStack.length - 1);

        setRedoStack([..._redoStack]);
        // setUndoStack([..._undoStack]);
    };

    const onSectionDrag = (_startTime: number, _endTime: number) => {
        // console.log('_startTime, _endTime', _startTime, _endTime);
        setStartTime(_startTime);
        setEndTime(_endTime);
    };

    const onBackClick = async () => {
        deletedSections = {};
        if(uploadedFromComputer) {
            onRedirect('back');
        } else if (s3FileContentId) {
            const response = await updateS3VideoStatus(s3FileContentId, {
                status: 'MP4 Created',
                uploaded_from: 's3'
            });
            response.status === 200 ? onRedirect('back') : setPopupMessage({ show: true, msg: 'Sorry, please try again later.' });
        } else {
            setPopupMessage({ show: true, msg: 'Sorry, please try again later.' });
        }
    };

    const uploadMultipartFile = async (file: File, payload: TStandardObject) => {
        try {
            const CHUNK_SIZE = 10000000; // 10MB
            const fileSize = file?.size ?? 0;
            const CHUNKS_COUNT = Math.floor(fileSize / CHUNK_SIZE) + 1;
            const promisesArray = [];
            let start, end, blob;

            for (let index = 1; index < CHUNKS_COUNT + 1; index++) {
                start = (index - 1) * CHUNK_SIZE;
                end = (index) * CHUNK_SIZE;
                blob = (index < CHUNKS_COUNT) ? file?.slice(start, end) : file?.slice(start);

                const queryParams = {
                    bucket_name: payload.bucket_name,
                    raw_file_name: payload.raw_file_name,
                    part_number: index,
                    upload_id: payload.upload_id,
                    file_name: payload.file_name,
                };

                // Get presigned URL for each part
                const response = await getSignedUrl(queryParams);
                if (response.status === 200) {
                    const responseData = response.data;
                    const presignedUrl = responseData;
                    // console.log(`Presigned URL : ${index}:${presignedUrl}filetype${file?.type}`);
                    // Send part aws server
                    const uploadResp = axios.put(presignedUrl, blob, {
                        headers: { 'Content-Type': file?.type }
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
                bucket_name: payload.bucket_name,
                file_name: payload.file_name,
                raw_file_name: payload.raw_file_name,
                upload_id: payload.upload_id,
                parts: uploadPartsArray,
                content_id: contentId
            };
            const completeUploadResp = await completeMultipartUpload(params);

            const { content_id } = completeUploadResp.data;
            // if (completeUploadResp.data) {
            //     const uploadParams = {
            //         content_id,
            //         content_name: videoTitle,
            //         type: videoType,
            //         template: {
            //             template_name: template,
            //             property_name: property,
            //             start_bumper: {
            //                 name: 'Start-Bumper',
            //                 s3_url: 'https://s3-url'
            //             },
            //             end_bumper: {
            //                 name: 'End Bumber',
            //                 s3_url: 'https://s3-url'
            //             }
            //         },
            //         property_name: property
            //     };
            //     const saveVideoResponse = await saveVideoData(uploadParams);

            //     if (saveVideoResponse.status === 200) {
            //         // 
            //     } else {
            //         console.log('error', completeUploadResp.error);
            //     }
            // }

        } catch (err) {
            console.log(err);
        }
    };

    const getTwoDigit = (x: number) => (x.toString().length < 2) ? '0' + x : x.toString();

    const formatTime = (x: number) => {
        const result: any = moment.duration(x, 'seconds');
        const ms = getTwoDigit(Math.floor(result._data.milliseconds));
        const newMs = ms.length > 2 ? ms.slice(0, -1) : ms;
        const formatedTime = getTwoDigit(result._data.hours) + ':' + getTwoDigit(result._data.minutes) + ':' + getTwoDigit(result._data.seconds) + ':' + newMs;
        return formatedTime;
    };

    const convertToSeconds = (time: string) => {
        const str = time;
        const strArr = str.split(':');
        const minutes = parseInt(strArr[1]);
        const seconds = parseInt(strArr[2]);
        const ms = strArr[3];
        const updatedSeconds = (minutes * 60) + seconds;
        const convertedTime = parseFloat(updatedSeconds + '.' + ms).toFixed(2);
        return convertedTime;
    };

    const onSubmitClick = async () => {
        setLoading(true);
        // setShowUploadProgress(!showUploadProgress);
        if (bumperFiles[0] !== null && bumperFiles[0] !== undefined) {
            const payload = {
                original_file_name: bumperFiles[0].name,
                content_type: 'video/mp4',
                property_name: propertyName,
                type: 'start_bumper',
                content_id: contentId
            };

            const response = await getUploadID(payload);
            if (response.status === 200) {
                const responseData = response.data;
                if (responseData) {
                    const uploadParams = {
                        bucket_name: responseData.bucket,
                        raw_file_name: responseData.raw_file_name,
                        file_name: responseData.file_name,
                        upload_id: responseData.upload_id,
                    };
                    await uploadMultipartFile(bumperFiles[0], uploadParams);
                }
            } else {
                console.log('error :>> ', response.error);
            }
        }

        if (bumperFiles[1] !== null && bumperFiles[1] !== undefined) {
            const payload = {
                original_file_name: bumperFiles[1].name,
                content_type: 'video/mp4',
                property_name: propertyName,
                type: 'end_bumper',
                content_id: contentId
            };

            const response = await getUploadID(payload);
            if (response.status === 200) {
                const responseData = response.data;
                if (responseData) {
                    const uploadParams = {
                        bucket_name: responseData.bucket,
                        raw_file_name: responseData.raw_file_name,
                        file_name: responseData.file_name,
                        upload_id: responseData.upload_id,
                    };
                    await uploadMultipartFile(bumperFiles[1], uploadParams);
                }
            } else {
                console.log('error :>> ', response.error);
            }
        }
        if (Object.keys(deletedSections).some(x => isInteger(x))) {
            // const data = Object.keys(deletedSections).map((x) => ({ startTime: x, endTime: deletedSections[x].toString() }));
            // console.log('data :>> ', data);
            const data = Object.keys(deletedSections).map((x) => (
                { startTime: formatTime(parseInt(x)), endTime: formatTime(deletedSections[x]) }
            ));
            // console.log('time: data :>> ', data);
            const newData: any = [];
            // console.log('---endDuration :>> ',endDuration);
            if (data[0].startTime !== '00:00:00:00') {
                data.map((x, i, ele) => {
                    if (i === 0) {
                        newData.push({ startTime: '00:00:00:00', endTime: x.startTime });
                    }
                    if (i === ele.length - 1) {
                        convertToSeconds(x.endTime) < convertToSeconds(endDuration) && newData.push({ startTime: x.endTime, endTime: endDuration });
                    } else {
                        newData.push({ startTime: x.endTime, endTime: ele[i + 1] && ele[i + 1].startTime });
                    }
                });
            } else {
                data.map((x, i, ele) => {
                    if (i === ele.length - 1) {
                        convertToSeconds(x.endTime) < convertToSeconds(endDuration) && newData.push({ startTime: x.endTime, endTime: endDuration });
                    } else {
                        newData.push({ startTime: x.endTime, endTime: ele[i + 1] && ele[i + 1].startTime });
                    }
                });
            }
            // console.log('newData :>> ', newData);
            setPopupMessage({ show: true, msg: 'Kindly wait till the video gets edited.' });
            const res = await videoLibraryDeleteSection({
                content_id: contentId,
                status: 'editing',
                is_video_edited: true,
                data: newData,
            });
            if (res.status === 200) {
                setLoading(false);
                onRedirect('next');
            } else {
                setLoading(false);
                setPopupMessage({ show: true, msg: 'Some Error occured while saving data.' });
                console.log('error :>> ', res.error);
            }
        } else {
            setLoading(false);
            onRedirect('next');
        }
    };

    const renderButttons = () => {
        const onClick = (type: 'back' | 'next') => {
            const changeDegree = type === 'back' ? -1 : 1;
            if ((currentThumbnailSection + changeDegree) >= 0 && (currentThumbnailSection + changeDegree < allThumbnails.length)) {
                setCurrentThumbnailSection((data) => data + changeDegree);
                setThumbnails(allThumbnails[currentThumbnailSection + changeDegree]);
            }
        };

        return (
            <>
                <div className={styles.buttonContainer}>
                    <Button id='back' buttonType={'secondary'} onClick={() => onClick('back')}>
                        <ArrowBackIcon fill={currentThumbnailSection === 0 ? 'gray' : 'red'} />
                    </Button>
                    <Button id='next' buttonType={'secondary'} onClick={() => onClick('next')}>
                        <ArrowForwardIcon fill={currentThumbnailSection === allThumbnails.length - 1 ? 'gray' : 'red'} />
                    </Button>
                </div>
            </>
        );
    };

    const renderThumbnails = () => {
        if (!isEmpty(thumbnails.length)) {
            return thumbnails.map(({ src, id, show }) => (show && <img key={id} id={`${src.slice(-40)}---${id}`} src={src} alt="thumbnail" />));
        } return (
            <div className={styles.loader}>
                <LoaderIcon />
            </div>
        );
    };

    return (
        <>
            <div className={styles.container}>
                <section className={styles.videoSection}>
                    <div className={styles.videoPlayerContainer}>
                        <VideoPlayer
                            options={videoPlayerOptions}
                            onReady={handlePlayerReady}
                            playing={onPlayingEvent}
                            onPlaybackEnd={onPlaybackEnd}
                        />
                    </div>
                    <div className={cx('split', styles.actionButtons)}>
                        <Button id={styles.playButton} onClick={onPlayButtonClick}>
                            {playing ? <PauseIcon /> : <PlayButtonIcon />}
                        </Button>
                        <div className={styles.videoEditActionButtons}>
                            <Button id={'undo'} onClick={() => {
                                if (!isEmpty(actionStack.length)) {
                                    onUndoClick();
                                }
                            }}>
                                <UndoIcon fill={isEmpty(actionStack.length) ? '#c1c1c1' : '#000000'} />
                            </Button>
                            <Button id={'redo'} onClick={() => {
                                if (!isEmpty(undoStack.length)) {
                                    onRedoClick();
                                }
                            }}>
                                <RedoIcon fill={isEmpty(undoStack.length) ? '#c1c1c1' : '#000000'} />
                            </Button>
                        </div>
                    </div>
                </section>
                <div className="split">
                    <Button id={'headBumperSelect'} onClick={() => onBumperSelectClick('head')}>
                        <div className={cx('split', styles.radioText)}>
                            {activeVideo === 'head' ? <CheckedRadioIcon /> : <UnCheckedRadioIcon />}
                            <span>Start Bumper</span>
                        </div>
                    </Button>
                    <Button id={'fullVideoSelect'} onClick={() => onBumperSelectClick('full')}>
                        <div className={cx('split', styles.radioText)}>
                            {activeVideo === 'full' ? <CheckedRadioIcon /> : <UnCheckedRadioIcon />}
                            <span>Full Video</span>
                        </div>
                    </Button>
                    <Button id={'endBumperSelect'} onClick={() => onBumperSelectClick('end')}>
                        <div className={cx('split', styles.radioText)}>
                            {activeVideo === 'end' ? <CheckedRadioIcon /> : <UnCheckedRadioIcon />}
                            <span>End Bumper</span>
                        </div>
                    </Button>
                </div>
                <div className="split">
                    <Button id={'headBumper'} onClick={() => onBumperChangeClick('head')}>
                        <Bumper />
                    </Button>
                    <div className={styles.thumbnailContainer}>
                        <Section onChange={onSectionDrag}>
                            <div id={'scroll'} ref={scrollRef} className={styles.thumbnails}>
                                {renderThumbnails()}
                            </div>
                        </Section>
                        {renderButttons()}
                    </div>
                    <Button id={'endBumper'} onClick={() => onBumperChangeClick('end')}>
                        <Bumper />
                    </Button>
                </div>
                <section className={styles.navigationActionButton}>
                    <div>
                        {!hideBackButton && <Button id={'back'} buttonType={'secondary'} onClick={onBackClick}> Back </Button>}
                    </div>
                    <Button id={'trash'} onClick={onDeleteClick}>
                        <div>
                            <TrashIcon />
                            <p>Delete</p>
                        </div>
                    </Button>
                    <Button id={'submit'} buttonType={'primary'} onClick={onSubmitClick} disabled={loading} showLoader={loading}> Submit </Button>
                </section>
            </div >
            <div className={styles.container}>
                <input
                    ref={fileUploadref}
                    type="file"
                    name="file"
                    id="file"
                    accept={'video/*,.mp4'}
                    onChange={onFileSelect}
                />
            </div>
            {popupMessage.show && (
                <MessagePopup message={popupMessage.msg} onCloseClick={() => setPopupMessage({ show: false, msg: '' })} />
            )}
        </>
    );
};

export default VideoLibraryDetail2;
