import { useEffect, useRef, useState } from 'react';
import { thumbnailList } from '../../api/thumbnail';
import Accordion from '../../components/Accordion/Accordion';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import CONSTANTS from '../../constants/constants';
import TStandardObject from '../../types/StandardObject';
import styles from './VideoLibraryDetail4.module.scss';
import videoPrevieStyle from '../../components/VideoPreviewModal/VideoPreviewModal.module.scss';
import { VideoJsPlayer } from 'video.js';
import MessagePopup from '../../components/MessagePopup/MessagePopup';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { VIDEO_LIBRARY_LISTING } from '../../utils/routes';
import { useHistory } from 'react-router-dom';
import { getContentDetails } from '../../api/videoDetail';

interface VideoLibraryDetail4Props {
    onRedirect: (type: string, payload?: any) => void
    transcodingFinished: boolean
    contentId: any
    outputPath?: any
    actionEdit: boolean
}

let aa: any;

const VideoLibraryDetail4 = ({ onRedirect, transcodingFinished, contentId, outputPath, actionEdit }: VideoLibraryDetail4Props): JSX.Element => {

    const [showVideoPreview, setShowVideoPreview] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ show: false, msg: '', redirectToVideoLibrary: false });

    const playerRef = useRef<VideoJsPlayer | null>(null);

    const [transcodedVideo, setTranscodedVideo] = useState<TStandardObject>({
        status: transcodingFinished,
        url: outputPath
    });

    const history = useHistory();

    useEffect(() => {
        getVideoData();
        aa = setInterval(() => {
            getVideoData();
        }, 1000 * 30);

        return () => {
            if (aa) clearInterval(aa);
        };
    }, []);

    useEffect(() => {
        if (transcodedVideo.status) {
            clearInterval(aa);
        }
    }, [transcodedVideo.status]);

    const handlePlayerReady = (player: VideoJsPlayer) => {
        playerRef.current = player;
        player.on('dispose', () => {
            console.log('player will dispose');
        });

        player.on('ready', () => {
            console.log('player is ready');
        });
    };

    const getVideoData = async () => {
        const params = {
            limit: 1,
            offset: 0
        };
        getContentDetails(contentId, params)
            .then((res) => {
                if (res) {
                    if (res.status === CONSTANTS.STATUS.COMPLETED) {
                        setTranscodedVideo({
                            status: true,
                            url: res.video_url
                        });
                        clearInterval(aa);
                    }
                }
            })
            .catch((err) => {
                console.log('err :>> ', err);
            });
    };

    const onModalClose = () => {
        setPopupMessage((prev) => {
            if (prev.redirectToVideoLibrary) onRedirect('next');
            return { ...popupMessage, show: false, msg: '' };
        });
    };

    const onVideoPreviewClick = () => {
        transcodedVideo.status ? setShowVideoPreview(true) : setPopupMessage({ ...popupMessage, show: true, msg: 'Kindly wait till video gets transcoded' });
    };

    return (
        <div className={styles.container}>

            {!transcodedVideo.status && <div className={styles.transcodingMessage}>
                <label>Your Video is transcoding now. Kindly wait till video gets transcoded.</label>
            </div>}

            <canvas id='canvas' height='100%' width='100%' style={{ display: 'none' }} />
            <Accordion title="Video Preview" id="videoPreview">
                <div className={styles.pushNow}>
                    <Button id="videoPreview" buttonType="secondary" styleClass={styles.buttonStyle} onClick={onVideoPreviewClick} showLoader={!transcodedVideo.status}>
                        Video Preview
                    </Button>
                    <Button id="close" buttonType="primary" styleClass={styles.buttonStyle} onClick={() => history.push(VIDEO_LIBRARY_LISTING)}>
                        Close
                    </Button>
                </div>
            </Accordion>
            {
                showVideoPreview && (
                    <Modal divId="fullscreenModal">
                        <div className={videoPrevieStyle.videoPreviewContainer}>
                            <VideoPlayer
                                options={{
                                    autoplay: false,
                                    controls: true,
                                    responsive: true,
                                    fluid: true,
                                    sources: [{
                                        src: transcodedVideo.url || '',
                                        type: 'application/x-mpegURL',
                                    }],
                                    height: 300,
                                    width: 650,
                                }}
                                onReady={handlePlayerReady}
                            />
                            <Button id="closePreviewModal" styleClass={videoPrevieStyle.closePreviewModal} onClick={() => setShowVideoPreview(false)} />
                        </div>
                    </Modal>
                )
            }
            {
                popupMessage.show && (
                    <MessagePopup message={popupMessage.msg} onCloseClick={onModalClose} />
                )
            }
        </div >
    );
};

export default VideoLibraryDetail4;
