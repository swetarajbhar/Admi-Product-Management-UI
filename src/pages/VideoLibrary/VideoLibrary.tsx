import moment from 'moment';
import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import DatePicker from 'react-datepicker';
import { useHistory } from 'react-router';
import { cloneVideoRecord, deleteVideoRecord, videoLibraryList } from '../../api/videoLibrary';
import { ReactComponent as CalendarIcon } from '../../assets/SVG/calendar.svg';
import { ReactComponent as ExportIcon } from '../../assets/SVG/export.svg';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Button from '../../components/Button/Button';
import Entry from '../../components/Entry/Entry';
import MessagePopup from '../../components/MessagePopup/MessagePopup';
import Modal from '../../components/Modal/Modal';
import Table from '../../components/Table/Table';
import CONSTANTS from '../../constants/constants';
import DATE_FORMAT from '../../constants/DATE_FORMAT';
import isEmpty from '../../utils/isEmpty';
import { BULK_VIDEO, VIDEO_LIBRARY_DETAIL, VIDEO_LIBRARY_DETAIL_VIEW } from '../../utils/routes';
import styles from './VideoLibrary.module.scss';
import { utcToLocal } from '../../utils/utcToLocalTime';

interface TableData {
    [key: string]: string | number | undefined | null;
}

const initialStartDate = new Date();
initialStartDate.setDate(1);

const VideoLibrary = (): JSX.Element => {

    const [data, setData] = useState<Array<TableData>>([]);
    const [filterBy, setFilterBy] = useState<string>(CONSTANTS.FILTER_BY.DATE_RANGE);
    const [search, setSearch] = useState<string>('');
    const [startDate, setStartDate] = useState<Date>(initialStartDate);
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [offset, setOffset] = useState(0);
    const [renderDeleteBox, setRenderDeleteBox] = useState(false);
    const [currentID, setCurrentID] = useState<string | number>('');
    const [csvData, setCsvData] = useState<Array<TableData>>([]);
    const [popupMessage, setPopupMessage] = useState({ show: false, msg: '' });

    const [currentPage, setCurrentPage] = useState(1);

    const history = useHistory();

    const limit = 10;
    const [totalCount, setTotalCount] = useState(0);

    const headers = ['Sr No', 'Video ID', 'Video Name', 'Uploaded On', 'Status', 'Transcription Job Name', 'Transcription Time', 'Transcription Status'];

    const csvHeaders = [
        { label: 'Video ID', key: 'contentId' },
        { label: 'Video Name', key: 'contentName' },
        { label: 'Property Name', key: 'propertyName' },
        { label: 'Uploaded On', key: 'uploadedOn' },
        { label: 'Status', key: 'status' },
        { label: 'Transcoding Time', key: 'transcodingTime' },
        { label: 'Pushed On', key: 'pushedAt' },
        { label: 'Active', key: 'isActive' },
    ];

    const onAddVideoClick = () => {
        // history.push(`${VIDEO_LIBRARY_DETAIL}`);
        history.push({
            pathname: `${VIDEO_LIBRARY_DETAIL}`,
            state: {
                action: CONSTANTS.ACTION.ADD,
                pathStep: 1,
            },
        });
    };

    const onActionClick = async (actionType: string, index: number | string) => {
        const videoData = data.find(x => x.contentId === index);
        const status = videoData?.status;
        const transcriptionStatus = videoData?.transcriptionStatus;
        // In Progress
        if (actionType === CONSTANTS.ACTION.VIEW) {
            history.push(`${VIDEO_LIBRARY_DETAIL_VIEW}/${index}`);
        }

        if (actionType === CONSTANTS.ACTION.EDIT) {
            let pathStep = 1;

            if (!transcriptionStatus || transcriptionStatus === '-') {
                setPopupMessage({ show: true, msg: 'Video Transcription error. Please upload video again.' });
                return;
            }
            if (status === CONSTANTS.STATUS.UPLOADED && transcriptionStatus === CONSTANTS.STATUS.COMPLETED) pathStep = 2;

            // transcode is complete or in progressgo to last step
            if ((status === CONSTANTS.STATUS.COMPLETED && transcriptionStatus === CONSTANTS.STATUS.COMPLETED) || (status === CONSTANTS.STATUS.IN_PROGRESS && transcriptionStatus === CONSTANTS.STATUS.COMPLETED)) pathStep = 3;
            if (transcriptionStatus === CONSTANTS.STATUS.FAILED) {
                setPopupMessage({ show: true, msg: 'Video transcription failed !!' });
            } else if (status === CONSTANTS.STATUS.UPLOADED && transcriptionStatus === CONSTANTS.STATUS.IN_PROGRESS) {
                // call api to update transcription status
                getVideoLibraryList(false);
                const updatedData = data.find(x => x.contentId === index);
                const updatedTranscriptionStatus = updatedData?.transcriptionStatus;
                updatedTranscriptionStatus === CONSTANTS.STATUS.IN_PROGRESS && setPopupMessage({ show: true, msg: 'Video transcription is in progress.' });
            } else {
                history.push({
                    pathname: `${VIDEO_LIBRARY_DETAIL}`,
                    state: {
                        action: CONSTANTS.ACTION.EDIT,
                        contentId: index,
                        pathStep,
                    },
                });
            }
        }

        if (actionType === CONSTANTS.ACTION.DELETE) {
            setCurrentID(index);
            setRenderDeleteBox(true);
        }
        if (actionType === CONSTANTS.ACTION.CLONE) {
            const response = await cloneVideoRecord(index);
            if (response.status === 200) {
                getVideoLibraryList(false);
                setPopupMessage({ show: true, msg: 'Video record cloned successfully' });
            } else {
                setPopupMessage({ show: true, msg: 'Some error occured. Please try again later.' });
            }
        }
    };

    const onMenuClick = (value: string) => {
        setSearch(value);
        setFilterBy(CONSTANTS.FILTER_BY.SEARCH_TEXT);
    };

    const getTranscodingTime = (startTime: string | null | undefined | number, endTime: string | null | undefined | number): string => {
        const transactionStartTime = isEmpty(startTime) ? '-' : moment(startTime).format(DATE_FORMAT.LONG_DATE_FORMAT);
        const transactionEndTime = isEmpty(endTime) ? '-' : moment(endTime).format(DATE_FORMAT.LONG_DATE_FORMAT);
        return `${transactionStartTime} to ${transactionEndTime}`;
    };

    const checkProperty = (value: any) => {
        if (isEmpty(value)) return '-';
        if (typeof (value) === 'object') return (value.name || '-');
        return value;
    };

    const getVideoLibraryList = async (isBulk: boolean) => {
        const param = {
            limit,
            offset,
            filterBy: filterBy,
            searchTerm: search,
            startDate: moment(startDate).format(DATE_FORMAT.SEARCH_DATE_FORMAT),
            endDate: moment(endDate).format(DATE_FORMAT.SEARCH_DATE_FORMAT),
        };
        const response = await videoLibraryList(isBulk ? { offset: 0 } : param);
        if (response.status === 200) {
            const formatedData: Array<{ [key: string]: string | number | undefined | null }> = [];
            const data = response?.data ?? [];
            setTotalCount(response?.totalRecord);
            data.forEach((data: any, index: number) => {
                formatedData.push({
                    srNo: index + 1 + offset,
                    contentId: data.content_id || '-',
                    contentName: data.content_name || '-',
                    uploadedOn: isEmpty(data.uploaded_on) ? '-' : moment.parseZone(utcToLocal(data.uploaded_on)).format(DATE_FORMAT.LONG_DATE_FORMAT),
                    status: data.status || '-',
                    //
                    transcriptionJobName: data.transcription_job_name || '-',
                    transcriptionTime: getTranscodingTime(utcToLocal(data.transcription_start_time), utcToLocal(data.transcription_completion_time)),
                    // pushedAt: isEmpty(data.pushed_at) ? '-' : moment.parseZone(data.pushed_at).format(DATE_FORMAT.LONG_DATE_FORMAT),
                    transcriptionStatus: data.transcription_status || '-'
                });
            });
            isBulk ? setCsvData(formatedData) : setData(formatedData);
        } else {
            isBulk ? setCsvData([]) : setData([]);
        }
    };

    // useEffect(() => {
    //     getVideoLibraryList(true);
    // }, []);

    useEffect(() => {
        getVideoLibraryList(false);
    }, [renderDeleteBox, search, startDate, endDate, offset]);

    const dateSearch = (dateType: string, date: Date) => {
        setOffset(0);
        setCurrentPage(1);
        dateType === 'startDate' && setStartDate(date);
        dateType === 'endDate' && setEndDate(date);
        setFilterBy(CONSTANTS.FILTER_BY.DATE_RANGE);
    };

    const onSubmit = async () => {
        if (currentID) {
            const response = await deleteVideoRecord(currentID);
            if (response.status === 200) {
                setRenderDeleteBox(false);
            }
        }
    };

    const onCancel = () => {
        setRenderDeleteBox(false);
    };

    const onPaginatonClick = (currentPage: any) => {
        setCurrentPage(currentPage);
        setOffset((currentPage - 1) * limit);
    };

    const onSearch = (value: string) => {
        setOffset(0);
        setCurrentPage(1);
        setSearch(value);
        setFilterBy(CONSTANTS.FILTER_BY.SEARCH_TEXT);
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.content}>
                    <Breadcrumb />
                    <Entry
                        id='search'
                        styleClass={styles.searchBar}
                        value={search}
                        onChange={(e) => { onSearch(e.target.value); }}
                    />
                    <div className={styles.datePickerWrapper}>
                        <DatePicker
                            selected={startDate}
                            onChange={(date: Date | null) => date && dateSearch('startDate', date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            dateFormat={DATE_FORMAT.SHORT_DATE_FORMAT}
                            placeholderText={DATE_FORMAT.STANDARD_DATE_FORMAT}
                            className={`${styles.startDate} ${styles.datepickerInput}`}
                            maxDate={new Date()}
                        />
                        <span style={{ paddingRight: '0.8em' }}>-</span>
                        <DatePicker
                            selected={endDate}
                            onChange={(date: Date | null) => date && dateSearch('endDate', date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            dateFormat={DATE_FORMAT.SHORT_DATE_FORMAT}
                            placeholderText={DATE_FORMAT.STANDARD_DATE_FORMAT}
                            className={styles.datepickerInput}
                            maxDate={new Date()}
                        />
                        <CalendarIcon className={styles.calendarIcon} />
                    </div>
                    {/* <CSVLink className={styles.exportButton} data={csvData} headers={csvHeaders} filename={CONSTANTS.VIDEO_LIBRARY_REPORT}>
                        Export <ExportIcon />
                    </CSVLink> */}
                    <Button buttonType="primary"
                        styleClass={styles.addVideoButton}
                        id={'addVideo'}
                        onClick={onAddVideoClick}
                    >
                        Add Video
                    </Button>
                    {/* <Button buttonType="primary"
                        styleClass={styles.addVideoButton}
                        id={'bulkVideo'}
                        onClick={() => history.push(BULK_VIDEO)}
                    >
                        Bulk Video
                    </Button> */}
                </div>
                <Table
                    headerData={headers}
                    data={data}
                    limit={limit}
                    totalRecords={totalCount}
                    currentPage={currentPage}
                    onActionClick={onActionClick}
                    onMenuClick={onMenuClick}
                    paginationButtonNo={3}
                    showActionColumn
                    showDeleteAction={false}
                    showViewAction={false}
                    showPagination
                    // showCloneBtn
                    wrapCol
                    columnToWrap={[2]}
                    onPaginatonClick={onPaginatonClick}
                    statusData={CONSTANTS.VIDEO_LIBRARY_STATUS}
                />
            </div>
            {renderDeleteBox && <Modal divId={'fullscreenModal'}>
                <div className={styles.deleteContainer}>
                    <h5>
                        Are you sure you want to delete this video?
                    </h5>
                    <div className="deleteSplit">
                        <Button id={styles.submit} buttonType={'primary'} onClick={onSubmit}>
                            Yes
                        </Button>
                        <Button id={styles.cancel} buttonType={'secondary'} onClick={onCancel}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>}

            {popupMessage.show && <MessagePopup message={popupMessage.msg} onCloseClick={() => setPopupMessage({ show: false, msg: '' })} />}
        </>
    );
};

export default VideoLibrary;
