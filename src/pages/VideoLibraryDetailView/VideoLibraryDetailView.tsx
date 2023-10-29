import { useEffect, useRef, useState } from 'react';
import { getVideoDetail, MetaData, VideoDetail } from '../../api/videoDetail';
import Accordion from '../../components/Accordion/Accordion';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import CustomCheckbox from '../../components/customCheckbox/CustomCheckbox';
import Entry from '../../components/Entry/Entry';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import isEmpty from '../../utils/isEmpty';
import styles from './VideoLibraryDetailView.module.scss';
import styles2 from '../VideoLibraryDetail4/VideoLibraryDetail4.module.scss';
import { VideoJsPlayer } from 'video.js';
import DatePicker from 'react-datepicker';
import DATE_FORMAT from '../../constants/DATE_FORMAT';
import { ReactComponent as Calendar } from '../../assets/SVG/calendar.svg';
import { ReactComponent as Clock } from '../../assets/SVG/clock.svg';
import Hls from 'hls.js';
import CONSTANTS from '../../constants/constants';

const VideoLibraryDetailView = (): JSX.Element => {

    const [videoDetail, setVideoDetail] = useState<Partial<VideoDetail & MetaData>>({});
    const [contentID, setContentID] = useState('');

    const playerRef = useRef<VideoJsPlayer | null>(null);
    const videoElementRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const id = window.location.pathname.split('/').pop();
        id && setContentID(id);
        if (id) {
            getVideoDetail(id)
                .then((res) => {
                    if (res) {
                        // console.log('res :>> ', res);
                        setVideoDetail({ ...res });
                    }
                });
        }
    }, []);

    useEffect(() => {
        if (videoDetail.output_path) {
            if (Hls.isSupported()) {
                const video = videoElementRef.current!;
                const hls = new Hls();
                hls.loadSource(videoDetail.output_path);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, function () {
                    video.play();
                });
            }
        }
    }, [videoDetail]);

    const handlePlayerReady = (player: VideoJsPlayer) => {
        playerRef.current = player;
        player.on('dispose', () => {
            console.log('player will dispose');
        });

        player.on('ready', () => {
            console.log('player is ready');
        });
    };

    return (
        <>
            <div className={styles.container}>
                <Breadcrumb />
                <div className={styles.content}>
                    <Accordion title={`Video ID: ${contentID}`} id="videoID">
                        <>
                            <div className={styles.row}>
                                <Entry
                                    id='contentName'
                                    placeholder='Content Name'
                                    styleClass={styles2.inputStyle}
                                    value={videoDetail.content_name || ''}
                                    disabled
                                />
                                <Entry
                                    id='propertyName'
                                    placeholder='Property Name'
                                    styleClass={styles2.inputStyle}
                                    value={videoDetail.property_name?.name || ''}
                                    disabled
                                />
                                <Entry
                                    id='templateName'
                                    placeholder='Template Name'
                                    styleClass={styles2.inputStyle}
                                    value={videoDetail.template?.template_name || ''}
                                    disabled
                                />
                            </div>
                            <div className={styles.row}>
                                <div style={{ height: '20em' }}>
                                    <video
                                        ref={videoElementRef}
                                        id={'videoViewDetail'}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            maxHeight: 'inherit'
                                        }}
                                        // src={'https://d1aw8iu1j7a29y.cloudfront.net/transcoder/assets/Zee_Hindustan/1800072/master.m3u8'}
                                        // typeof={'application/x-mpegURL'}
                                        controls>
                                        {/* <source src={'https://d1aw8iu1j7a29y.cloudfront.net/transcoder/assets/Zee_Hindustan/1800072/master.m3u8'} type={'application/x-mpegURL'} /> */}
                                    </video>
                                    {/* <VideoPlayer
                                        options={{
                                            autoplay: true,
                                            controls: true,
                                            responsive: true,
                                            fluid: true,
                                            sources: [{
                                                src: 'https://d1aw8iu1j7a29y.cloudfront.net/transcoder/assets/Zee_Hindustan/1800072/master.m3u8',
                                                type: 'application/mpeg-URL',
                                            }],
                                            height: 300,
                                            width: 650,
                                        }}
                                        onReady={handlePlayerReady}
                                    /> */}
                                </div>
                            </div>
                        </>
                    </Accordion>
                    <Accordion title='Metadata' id="metadata">
                        <div className={''}>
                            <div className={styles2.label}>Title (Put English Title Only)</div>
                            <Entry
                                id='title'
                                placeholder='Title'
                                styleClass={styles2.inputStyle}
                                value={videoDetail.meta_data?.title || ''}
                                disabled
                            />
                            <div className={styles2.label}>Mobile Title (Put Mobile Title in English Only)</div>
                            <Entry
                                id='mobileTitle'
                                placeholder='Title'
                                styleClass={styles2.inputStyle}
                                value={videoDetail.meta_data?.mobile_title || ''}
                                disabled
                            />
                            <div className={styles2.label}>Slug (English)</div>
                            <Entry
                                id='slugEnglish'
                                placeholder='Slug'
                                styleClass={styles2.inputStyle}
                                value={videoDetail.meta_data?.slug || ''}
                                disabled
                            />
                            <div className={styles2.label}>Description (Put English Description Only)</div>
                            <Entry
                                id='descriptionEnglish'
                                placeholder='Description'
                                styleClass={styles2.inputStyle}
                                value={videoDetail.meta_data?.description || ''}
                                disabled
                            />
                            <div className={styles2.label}>Tags (Put English Tags Only)</div>
                            <Entry
                                id='tagEnglish'
                                placeholder='Tag'
                                styleClass={styles2.inputStyle}
                                value={videoDetail.meta_data?.tags?.map((x: string) => x).join(', ') || ''}
                                disabled
                            />
                            <div className={styles2.label}>Site</div>
                            <Entry
                                id='section'
                                placeholder='Site'
                                styleClass={styles2.inputStyle}
                                value={videoDetail.meta_data?.section?.section_name || ''}
                                disabled
                            />
                            <div className={styles2.label}>Author</div>
                            <Entry
                                id='author'
                                placeholder='Enter Author'
                                styleClass={styles2.inputStyle}
                                value={videoDetail.meta_data?.author || ''}
                                disabled
                            />
                            <div className={styles2.label}>User</div>
                            <Entry
                                id='user'
                                placeholder='Enter User'
                                styleClass={styles2.inputStyle}
                                value={videoDetail.meta_data?.user || ''}
                                disabled
                            />
                            <div className={styles2.label}>Property</div>
                            <Entry
                                id='property'
                                placeholder='Property'
                                styleClass={styles2.inputStyle}
                                value={videoDetail.meta_data?.property?.map((x) => x.property_name).join(', ') || ''}
                                disabled
                            />
                            <div className={styles2.label}>Regional Title (Put Regional Title Only)</div>
                            <Entry
                                id='titleRegional'
                                placeholder='Enter Title'
                                styleClass={styles2.inputStyle}
                                value={videoDetail.meta_data?.regional_title || ''}
                                disabled
                            />
                            <div className={styles2.label}>Mobile Regional Title (Put Mobile Regional Title Only)</div>
                            <Entry
                                id='mobileTitleRegional'
                                placeholder='Enter Mobile Title'
                                styleClass={styles2.inputStyle}
                                value={videoDetail.meta_data?.mobile_regional_title || ''}
                                disabled
                            />
                            <div className={styles2.label}>Slug (Regional)</div>
                            <Entry
                                id='slugRegional'
                                placeholder='Enter Slug'
                                styleClass={styles2.inputStyle}
                                value={videoDetail.meta_data?.slug_regional || ''}
                                disabled
                            />
                            <div className={styles2.label}>Description (Put Regional Description Only)</div>
                            <Entry
                                id='descriptionRegional'
                                placeholder='Enter Description'
                                styleClass={styles2.inputStyle}
                                value={videoDetail.meta_data?.regional_description || ''}
                                disabled
                            />
                            <div className={styles2.label}>Tags (Put Regional Tags Only)</div>
                            <Entry
                                id='tagRegional'
                                placeholder='Enter Tags'
                                styleClass={styles2.inputStyle}
                                value={videoDetail.meta_data?.regional_tags?.map((x) => x).join(', ') || ''}
                                disabled
                            />

                            {/* <div className={styles2.checkboxWrapper}>
                                <CustomCheckbox id='breakingNews' value='Breaking News' checked={videoDetail.meta_data?.is_breaking_news || false} />
                                <CustomCheckbox id='forGoogleAssistant' value='For Google Assistance' checked={videoDetail.meta_data?.for_google_assistant || false} />
                            </div> */}

                            <div className={styles2.label}>Category</div>
                            <Entry
                                id='category'
                                placeholder='Category'
                                styleClass={styles2.inputStyle}
                                value={videoDetail.meta_data?.catalogue?.map((x) => x.catalogue_name).join(', ') || ''}
                                disabled
                            />
                            <div className={styles2.label}>TV Shows</div>
                            <Entry
                                id='tvShow'
                                placeholder='Enter TV Shows'
                                styleClass={styles2.inputStyle}
                                value={videoDetail.meta_data?.tv_shows?.map((x) => x).join(', ') || ''}
                                disabled
                            />
                            {/* <div className={styles2.postToWrapper}>
                                {videoDetail.meta_data?.is_post_to_twitter && 
                                    <>
                                    <CustomCheckbox id='postToTwtCb' value='Post to Twitter' checked={videoDetail.meta_data?.is_post_to_twitter || false} />
                                    <Entry
                                        id='postToTwtTitle'
                                        placeholder=''
                                        styleClass={styles2.inputStyle}
                                        value={videoDetail.meta_data?.twitter_title || ''}
                                        disabled
                                    />
                                    </>
                                }
                                {videoDetail.meta_data?.is_post_to_instagram && 
                                    <>
                                    <CustomCheckbox id='postToInstaCb' value='Post to Instagram' checked={videoDetail.meta_data?.is_post_to_instagram || false} />
                                    <Entry
                                        id='postToInstaTitle'
                                        placeholder=''
                                        styleClass={styles2.inputStyle}
                                        value={videoDetail.meta_data?.instagram_title || ''}
                                        disabled
                                    />
                                    </>
                                }
                                {videoDetail.meta_data?.is_post_to_youtube && 
                                    <>
                                    <CustomCheckbox id='postToYoutubeCb' value='Post to Youtube' checked={videoDetail.meta_data?.is_post_to_youtube || false} />
                                    <Entry
                                        id='postToYoutubeTitle'
                                        placeholder=''
                                        styleClass={styles2.inputStyle}
                                        value={videoDetail.meta_data?.youtube_title || ''}
                                        disabled
                                    />
                                    </>
                                }
                            </div> */}
                        </div>
                    </Accordion>
                    <Accordion title='Schedule the Push' id="scheduleThePush">
                        <>
                        <div className={styles2.postToWrapper}>
                            {videoDetail.push_data?.is_post_to_twitter && 
                                <>
                                <CustomCheckbox id='postToTwtCb' value='Post to Twitter' checked={videoDetail.push_data?.is_post_to_twitter || false} />
                                <Entry
                                    id='postToTwtTitle'
                                    placeholder=''
                                    styleClass={styles2.inputStyle}
                                    value={videoDetail.push_data?.twitter_title || ''}
                                    disabled
                                />
                                </>
                            }
                            {videoDetail.push_data?.is_post_to_instagram && 
                                <>
                                <CustomCheckbox id='postToInstaCb' value='Post to Instagram' checked={videoDetail.push_data?.is_post_to_instagram || false} />
                                <Entry
                                    id='postToInstaTitle'
                                    placeholder=''
                                    styleClass={styles2.inputStyle}
                                    value={videoDetail.push_data?.instagram_title || ''}
                                    disabled
                                />
                                </>
                            }
                            {videoDetail.push_data?.is_post_to_youtube && 
                                <>
                                <CustomCheckbox id='postToYoutubeCb' value='Post to Youtube' checked={videoDetail.push_data?.is_post_to_youtube || false} />
                                <Entry
                                    id='postToYoutubeTitle'
                                    placeholder=''
                                    styleClass={styles2.inputStyle}
                                    value={videoDetail.push_data?.youtube_title || ''}
                                    disabled
                                />
                                </>
                            }
                        </div>
                        {videoDetail.push_data?.push_schedule === CONSTANTS.SCHEDULE_THE_PUSH.SCHEDULE_FOR_LATER && (
                            <div className={styles2.scheduleForLater}>
                                <div>
                                    Schedule Date
                                    <div className={styles2.scheduleDateWrapper}>
                                        <DatePicker
                                            selected={videoDetail.push_data?.push_date_time}
                                            onChange={() => {
                                                // 
                                            }}
                                            placeholderText='Schedule Date'
                                            dateFormat={DATE_FORMAT.SHORT_DATE_FORMAT}
                                            className={styles2.datepickerInput}
                                            disabled
                                        />
                                        <Calendar className={styles2.datepickerIcon} />
                                    </div>
                                </div>
                                <div>
                                    Time
                                    <div className={styles2.scheduleDateWrapper}>
                                        <DatePicker
                                            selected={videoDetail.push_data?.push_date_time}
                                            onChange={() => {
                                                // 
                                            }}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                            placeholderText='Schedule Time'
                                            className={styles2.datepickerInput}
                                            disabled
                                        />
                                        <Clock className={styles2.datepickerIcon} />
                                    </div>
                                </div>
                            </div>
                        )}
                        </>
                    </Accordion>
                    <Accordion title='Thumbnail' id="thumbnail">
                        <div className={styles2.row}>
                            <img src={videoDetail.custom_thumbnail?.url} alt="Thumbnail" className={styles.imagePreview} height='300' width='400' />
                        </div>
                    </Accordion>
                </div>
            </div>
        </>
    );
};

export default VideoLibraryDetailView;
