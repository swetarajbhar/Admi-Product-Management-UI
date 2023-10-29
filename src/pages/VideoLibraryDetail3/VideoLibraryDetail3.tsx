import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { transcodeVideo, updateVttFile } from '../../api/step3';
import { getContentDetails } from '../../api/videoDetail';
import Button from '../../components/Button/Button';
import MessagePopup from '../../components/MessagePopup/MessagePopup';
import { VIDEO_LIBRARY_LISTING } from '../../utils/routes';
import styles from './VideoLibraryDetail3.module.scss';
import moment from 'moment';
import Table from '../../components/Table/Table';
import TStandardObject from '../../types/StandardObject';

interface IProps {
    onRedirect: (type: string) => void
    contentId: any
}

let subtitleChanged = false;
let uri = '';
let allSubtitleData = [
    {
        'start_time': '',
        'end_time': '',
        'alternatives': [
            {
                'confidence': '',
                'content': ''
            }
        ]
    }
];

const limit = 100;

const VideoLibraryDetail3 = ({ onRedirect, contentId }: IProps): JSX.Element => {

    const [popupMessage, setPopupMessage] = useState({ show: false, msg: '' });
    const [transcodedMessage, setTranscodedMessage] = useState({ show: false, msg: '', redirectNext: false });
    const [submitAndTranscodeLoading, setSubmitAndTranscodeLoading] = useState(false);

    const [data, setData] = useState<Array<TStandardObject>>([]);
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [loading, setLoading] = useState(true);

    const [totalCount, setTotalCount] = useState(0);

    const history = useHistory();

    useEffect(() => {
        getSubTitleData(false);
    }, []);

    useEffect(() => {
        getSubTitleData(true);
    }, [offset]);

    const getUpdatedSubs = (alternatives: any = [], idx: number, _offset: number) => {
        const updatedSubtitle = allSubtitleData.length > 0 ? allSubtitleData[idx + _offset]?.alternatives[0]?.content ?? null : null;
        return updatedSubtitle ? updatedSubtitle : alternatives.length > 0 ? alternatives[0].content || '-' : '-';
    };

    const getSubTitleData = async (pagination: boolean) => {
        const params = {
            limit,
            offset
        };
        getContentDetails(contentId, pagination ? params : {})
            .then(res => {
                if (res) {
                    const data = res?.transcript_vtt_data?.vtt || [];
                    // setData(data);

                    if (pagination) {
                        const formatedData = data.map((x: any, index: number) => {
                            return {
                                srNo: index + 1 + offset,
                                startTime: renderTime(x.start_time),
                                endTime: renderTime(x.end_time),
                                data: getUpdatedSubs(x.alternatives, index, offset)
                            };
                        });

                        setData(formatedData);
                        setTotalCount(res?.transcript_vtt_data?.totalCount || 0);
                        setLoading(false);
                    } else {
                        uri = res?.transcript_subtitle_file_uri;
                        allSubtitleData = data;
                    }
                }
            })
            .catch(error => {
                console.log('error :>> ', error);
                setLoading(false);
            });
    };

    // const onBackClick = () => {
    //     onRedirect('back');
    // };

    const onBackClick = async () => {
        history.push(VIDEO_LIBRARY_LISTING);
    };

    const onSubmitAndTranscodeClick = async () => {
        if (subtitleChanged) {
            // upload vtt file thn transcode
            const bodyParam = {
                transcript_vtt_data: {
                    vtt: [...allSubtitleData]
                },
                transcript_subtitle_file_uri: uri
            };
            setSubmitAndTranscodeLoading(true);
            const response = await updateVttFile(contentId, bodyParam);
            if (response.status === 200) {
                setPopupMessage({ show: true, msg: 'Subtitle updated successfully. Sending video to be transcoded' });
                transcode();
            } else {
                setPopupMessage({ show: true, msg: 'Could not update data' });
            }
        } else {
            // transcode video
            setSubmitAndTranscodeLoading(true);
            transcode();
        }
    };

    const transcode = async () => {
        const response = await transcodeVideo(contentId);
        if (response) setPopupMessage({ show: false, msg: '' });
        if (response.status === 200) {
            setTranscodedMessage({ show: true, msg: 'Please wait while video is being transcoded', redirectNext: true });
        } else {
            // redirect to listing on ok click
            setTranscodedMessage({ show: true, msg: 'Could not transcode video', redirectNext: false });
        }
        setSubmitAndTranscodeLoading(false);
    };

    const onSubtitleChange = (id: number, x: string) => {
        if (subtitleChanged === false) subtitleChanged = true;
        const a = [...data];
        a[id].data = x;
        setData(a);
        allSubtitleData[id + offset].alternatives[0].content = x;
    };

    const renderTime = (x: string) => {
        if (!x) return '-';
        const duration = moment.duration(x, 'seconds');
        return `${duration.hours()}:${duration.minutes()}:${duration.seconds()}.${Math.round(duration.milliseconds())}`;
    };

    const onPaginatonClick = (currentPage: any) => {
        setCurrentPage(currentPage);
        setOffset((currentPage - 1) * limit);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headingStyle}>
                    Edit Subtitles
                </div>
            </div>

            {/* <table className={styles.tableStyle}>
                <tr>
                    <th>Sr. No.</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Content</th>
                </tr>
                {(data.length <= 0 && loading) && 'Loading data...'}
                {data.map((x, id) => (
                    <tr key={`${id}-${(x.start_time || 1).toString()}-${(x.end_time || 1).toString()}`}>
                        <td>{id + 1}</td>
                        <td className={styles.wrapCol}>{renderTime(x.start_time)}</td>
                        <td className={styles.wrapCol}>{renderTime(x.end_time)}</td>
                        <td>
                            <EditableText id={id} data={x.alternatives ? x.alternatives[0]?.content : ''} onSubtitleChange={(_id, txt) => onSubtitleChange(_id, txt)} />
                        </td>
                    </tr>
                ))}
            </table> */}

            <Table
                headerData={['Sr. No.', 'Start Time', 'End Time', 'Content']}
                data={data}
                limit={limit}
                totalRecords={totalCount}
                currentPage={currentPage}
                paginationButtonNo={3}
                showDeleteAction={false}
                showViewAction={false}
                showEditAction={false}
                showPagination
                // wrapCol
                // columnToWrap={[1]}
                onPaginatonClick={onPaginatonClick}
                inputBoxCol={3}
                onSubtitleChange={onSubtitleChange}
                breakWord
            />

            <div className={styles.buttonWrapper}>
                <Button
                    id="back"
                    buttonType="secondary"
                    styleClass={styles.buttonStyle}
                    onClick={onBackClick}
                >
                    Back
                </Button>
                <Button
                    id="submitAndTranscode"
                    buttonType="primary"
                    styleClass={styles.buttonStyle}
                    onClick={onSubmitAndTranscodeClick}
                    disabled={submitAndTranscodeLoading}
                    showLoader={submitAndTranscodeLoading}
                >
                    Submit &amp; Transcode
                </Button>
            </div>

            {/* {modal.show && renderAddModal()} */}

            {popupMessage.show && (
                <MessagePopup message={popupMessage.msg} onCloseClick={() => setPopupMessage({ show: false, msg: '' })} />
            )}

            {transcodedMessage.show && (
                <MessagePopup
                    message={transcodedMessage.msg}
                    onCloseClick={() => transcodedMessage.redirectNext ? onRedirect('next') : history.push(VIDEO_LIBRARY_LISTING)}
                    buttonText='Ok'
                />
            )}
        </div>
    );
};

export default VideoLibraryDetail3;
