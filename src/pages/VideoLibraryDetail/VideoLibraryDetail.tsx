
import { useEffect, useState } from 'react';
import { getContentDetails, getVideoDetail, VideoDetail } from '../../api/videoDetail';
import SelectVideo from '../../components/SelectVideo/SelectVideo';
import Steps, { IStep } from '../../components/Steps/Steps';
import CONSTANTS from '../../constants/constants';
import TStandardObject from '../../types/StandardObject';
import VideoLibraryDetail2 from '../VideoLibraryDetail2/VideoLibraryDetail2';
import VideoLibraryDetail3 from '../VideoLibraryDetail3/VideoLibraryDetail3';
import VideoLibraryDetail4 from '../VideoLibraryDetail4/VideoLibraryDetail4';
import styles from './VideoLibraryDetail.module.scss';
import { useHistory } from 'react-router';
import { VIDEO_LIBRARY_LISTING } from '../../utils/routes';

const steps: Array<IStep> = [
    {
        displayValue: '1',
        name: 'Select Video'
    },
    {
        displayValue: '2',
        name: 'Transcode Video'
    },
    {
        displayValue: '3',
        name: 'Video Preview'
    },
];

const VideoLibraryDetail = (props: TStandardObject): JSX.Element => {

    const [videoDetail, setVideoDetail] = useState<Partial<VideoDetail>>({});

    const [step, setStep] = useState(1);
    const [contentId, setContentId] = useState('');

    const history = useHistory();

    useEffect(() => {
        const { contentId, action, pathStep } = props.location.state;
        setStep(pathStep);
        if (action === CONSTANTS.ACTION.EDIT) {
            setContentId(contentId);
            const params = {
                limit: 1,
                offset: 0
            };
            getContentDetails(contentId, params)
                .then((res) => {
                    if (res) {
                        setVideoDetail({ ...res });
                        setStep(pathStep);
                    }
                })
                .catch((err) => {
                    console.log('err :>> ', err);
                });
        }
    }, []);

    const updateStep = (btnType: string, payload?: any) => {
        if (btnType === 'next') {
            const currentStep = step + 1;
            setVideoDetail({
                ...videoDetail,
                ...payload
            });
            if (step === 1) {
                // 
            }
            if (step < 3) setStep(currentStep);
            if (step === 3) history.push(VIDEO_LIBRARY_LISTING);
        }
        if (btnType === 'back') {
            const currentStep = step - 1;
            setStep(currentStep);
        }
    };

    const updateContentId = (contentId: string) => {
        setContentId(contentId);
    };

    const renderStep = () => {
        const { action, fromRecentActivity } = props.location.state;
        const stepNumber = step;
        if (stepNumber === 1) {
            // const aa = { ...videoDetail?.meta_data?.property[0] };
            return (
                <SelectVideo
                    onRedirect={updateStep}
                    updateContentId={updateContentId}
                />
            );
        }
        if (stepNumber === 2) {
            return (
                <VideoLibraryDetail3
                    onRedirect={updateStep}
                    contentId={contentId}
                />
            );
        }
        if (stepNumber === 3) {
            return (
                <VideoLibraryDetail4
                    onRedirect={updateStep}
                    contentId={contentId}
                    transcodingFinished={videoDetail.status === CONSTANTS.STATUS.COMPLETED}
                    outputPath={videoDetail.video_url}
                    actionEdit={action === CONSTANTS.ACTION.EDIT}
                />
            );
        } return null;
    };

    return (
        <div className={styles.container}>
            <Steps steps={steps} currentStep={step} />
            {renderStep()}
        </div>
    );
};

export default VideoLibraryDetail;
