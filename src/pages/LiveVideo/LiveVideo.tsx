import { useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Entry from '../../components/Entry/Entry';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import isEmpty from '../../utils/isEmpty';
import styles from './LiveVideo.module.scss';
import styles2 from '../VideoLibraryDetail4/VideoLibraryDetail4.module.scss';
import { VideoJsPlayer } from 'video.js';
import DatePicker from 'react-datepicker';
import DATE_FORMAT from '../../constants/DATE_FORMAT';
import { ReactComponent as Calendar } from '../../assets/SVG/calendar.svg';
import { ReactComponent as Clock } from '../../assets/SVG/clock.svg';
import Hls from 'hls.js';
import CONSTANTS from '../../constants/constants';
import Select from 'react-select';
import TStandardObject from '../../types/StandardObject';
import LOCALSTORAGE from '../../constants/LOCALSTORAGE';
import Button from '../../components/Button/Button';
import moment, { Moment } from 'moment';
import MessagePopup from '../../components/MessagePopup/MessagePopup';
import { trimLiveVideo } from '../../api/liveVideo';
import TimePicker from 'react-time-picker';
import '../../styles/timePicker.css';

const LiveVideo = (): JSX.Element => {
    const [property, setProperty] = useState(null);
    const [propertyData, setPropertyData] = useState<Array<TStandardObject>>([]);
    const [liveUrl, setLiveUrl] = useState('');
    const [liveUrlStartTime, setLiveUrlStartTime] = useState<Moment>();
    const [popupMessage, setPopupMessage] = useState({ show: false, msg: '' });
    const [loading, setLoading] = useState(false);

    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [fileName, setFileName] = useState('');

    const [error, setError] = useState({
        property: false,
        startTime: false,
        endTime: false,
        fileName: false
    });

    const videoElementRef = useRef<HTMLVideoElement | null>(null);

    // useEffect(() => {
    //     const propData = JSON.parse(localStorage[LOCALSTORAGE.PROPERTY])?.filter((x: TStandardObject) => (x.value !== 'DNA' && x.value !== 'ZeeNews-HLS-To-MP4' && x.value !== 'test2' && x.value !== 'WION1 update')) ?? [];
    //     if (propData && propData[0] !== null) {
    //         setPropertyData(propData);
    //         setProperty(propData[0]);
    //         setLiveUrl(propData[0].liveUrl);
    //     }
    // }, []);

    useEffect(() => {
        let hls: Hls;
        function _initPlayer() {
            if (hls != null) {
                hls.destroy();
            }

            const newHls = new Hls({
                enableWorker: false,
            });

            if (videoElementRef.current != null) {
                newHls.attachMedia(videoElementRef.current);
            }

            newHls.on(Hls.Events.MEDIA_ATTACHED, () => {
                const startTime = subtractOneHour(moment());
                setLiveUrlStartTime(startTime);
                newHls.loadSource(`${liveUrl}?start=${startTime.format()}`);                
                newHls.on(Hls.Events.MANIFEST_PARSED, () => {                  
                    videoElementRef?.current
                      ?.play()
                      .catch(() =>
                        console.log(
                          'Unable to autoplay prior to user interaction with the dom.'
                        )
                      );
                });
            });

            newHls.on(Hls.Events.ERROR, function (event, data) {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            newHls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            newHls.recoverMediaError();
                            break;
                        default:
                            _initPlayer();
                            break;
                    }
                }
            });

            hls = newHls;
        }

        // Check for Media Source support
        if (Hls.isSupported()) {
            _initPlayer();
        }

        return () => {
            if (hls != null) {
                hls.destroy();
            }
        };
    }, [liveUrl]);

    const subtractOneHour = (time: Moment) => {
        const timeToSubtract = moment.duration('01:00:00');
        const updatedTime = time.subtract(timeToSubtract);
        return updatedTime;
    };

    const onPropertyChange = (e: any) => {
        setProperty(e);
        const startTime = subtractOneHour(moment());
        setLiveUrlStartTime(startTime);
        setLiveUrl(e.liveUrl);
    };

    const onProcessFileClick = async () => {
        // const pattern = /([0-9]|[A-Z]|[a-z]|[!\-_.*'()])+/;
        const pattern = /[ `@#$%^&+=[\]{};:"|,<>/?~]/;
        const isInValidFilename = pattern.test(String(fileName));
        if (fileName === '' || isInValidFilename) {
            setPopupMessage({
                show: true,
                msg: 'The given file name should not contain space. It must have alphanumeric characters and only special characters like- ! ( ) . - _ \' *'
            });
        } else if (isEmpty(startTime) || isEmpty(endTime)) {
            setPopupMessage({
                show: true,
                msg: 'Please enter valid start time and end time'
            });
        } else {
            const liveST = liveUrlStartTime && liveUrlStartTime.clone();
            const updatedStartTime = addTime(liveST, startTime);
            const updatedEndTime = addTime(liveST, endTime);
            if (updatedStartTime && updatedEndTime) {
                const bodyParam: TStandardObject = {
                    start_time: updatedStartTime,
                    end_time: updatedEndTime,
                    channel_name: property && property['value'],
                    file_name: fileName
                };
                setLoading(true);
                const response = await trimLiveVideo(bodyParam);
                if (response.status === 200) {
                    setPopupMessage({ show: true, msg: 'File is being processed, please wait' });
                    setLoading(false);
                } else {
                    setPopupMessage({ show: true, msg: 'Some Error Occured Please Try Again Later!' });
                    setLoading(false);
                }
            }
        }
    };

    const addTime = (liveStartTime: any, time: any) => {
        const liveST = liveStartTime.clone();
        const splitTime = time.split(':');
        if (splitTime.length === 3) {
            const addingTime = liveST.add(splitTime[0], 'hours').add(splitTime[1], 'minutes').add(splitTime[2], 'seconds');
            return addingTime?.format('YYYY-MM-DD HH:mm:ss');
        }
        return null;
    };

    const onFileNameChange = (e: any) => {
        setFileName(e.target.value);
        setError({
            ...error,
            fileName: isEmpty(e.target.value)
        });
    };

    const onStartTimeChange = (e: any) => {
        setStartTime(e);
    };

    const onEndTimeChange = (e: any) => {
        setEndTime(e);
    };

    return (
        <>
            <div className={styles.container}>
                <Breadcrumb />
                <div className={styles.content}>
                    <div className={styles.row}>
                        <div className={styles.propertyContainer}>
                            Select Channel
                            <Select
                                closeMenuOnSelect
                                onChange={onPropertyChange}
                                value={property}
                                placeholder="Select Property"
                                options={propertyData}
                                className={styles.selectStyle}
                            />
                        </div>
                    </div>
                    {/* {liveUrl && ( */}
                    <div className={styles.videoContainer}>
                        {/* <div style={{ height: '20em' }}> */}
                        <video
                            ref={videoElementRef}
                            id={'videoViewDetail'}
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxHeight: 'inherit'
                            }}
                            controls>
                        </video>
                        {/* </div> */}
                    </div>
                    {/* )} */}
                    <div className={styles.timeContainer}>
                        <div>
                            Start Time <br />
                            <TimePicker
                                className='borderStyle'
                                onChange={onStartTimeChange}
                                value={startTime}
                                disableClock
                                format='HH:mm:ss'
                                // hourPlaceholder='HH'
                                // minutePlaceholder='MM'
                                // secondPlaceholder='SS'
                                maxDetail='second'
                            // minTime='22:15:00'
                            />
                        </div>
                        <div>
                            End Time <br />
                            <TimePicker
                                className='borderStyle'
                                onChange={onEndTimeChange}
                                value={endTime}
                                disableClock
                                format='HH:mm:ss'
                                // hourPlaceholder='HH'
                                // minutePlaceholder='MM'
                                // secondPlaceholder='SS'
                                maxDetail='second'
                                minTime={startTime}
                            />
                        </div>
                        <div>
                            File Name <br />
                            <Entry
                                id='fileName'
                                type='text'
                                styleClass={styles.inputStyle}
                                placeholder='File Name'
                                value={fileName}
                                onChange={onFileNameChange}
                            />
                            {error.fileName && <small className={styles.errorMessage}>Please enter valid file name</small>}
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div>
                            <Button buttonType="primary"
                                styleClass={styles.addVideoButton}
                                id={'processFile'}
                                onClick={onProcessFileClick}
                                disabled={loading}
                                showLoader={loading}
                            >
                                Process File
                            </Button>
                        </div>
                    </div>
                </div>

                {popupMessage.show && (
                    <MessagePopup message={popupMessage.msg} onCloseClick={() => setPopupMessage({ show: false, msg: '' })} />
                )}
            </div>
        </>
    );
};

export default LiveVideo;
