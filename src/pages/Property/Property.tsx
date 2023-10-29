import moment from 'moment';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useHistory } from 'react-router';
import { deleteProperty, propertyMasterList } from '../../api/property';
import { deleteVideoRecord } from '../../api/videoLibrary';
import { ReactComponent as CalendarIcon } from '../../assets/SVG/calendar.svg';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Button from '../../components/Button/Button';
import Entry from '../../components/Entry/Entry';
import MessagePopup from '../../components/MessagePopup/MessagePopup';
import Modal from '../../components/Modal/Modal';
import Table from '../../components/Table/Table';
import CONSTANTS from '../../constants/constants';
import DATE_FORMAT from '../../constants/DATE_FORMAT';
import { PROPERTY_MASTER_DETAIL } from '../../utils/routes';
import styles from './Property.module.scss';

interface TableData {
    [key: string]: string | number | undefined | null;
}

const initialStartDate = new Date();
initialStartDate.setDate(1);

const Property = (): JSX.Element => {

    const [data, setData] = useState<Array<TableData>>([]);
    const [filterBy, setFilterBy] = useState<string>(CONSTANTS.FILTER_BY.DATE_RANGE);
    const [search, setSearch] = useState<string>('');
    const [startDate, setStartDate] = useState<Date>(initialStartDate);
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [offset, setOffset] = useState(0);
    const [renderDeleteBox, setRenderDeleteBox] = useState(false);
    const [currentID, setCurrentID] = useState<string | number>('');
    const [popupMessage, setPopupMessage] = useState({ show: false, msg: '' });

    const [currentPage, setCurrentPage] = useState(1);

    const history = useHistory();

    const limit = 10;
    const [totalCount, setTotalCount] = useState(0);

    const headers = ['Sr No', 'Property ID', 'Property Name', 'Video Sections', 'Created By', 'Created On'];

    const onAddClick = () => {
        history.push({
            pathname: `${PROPERTY_MASTER_DETAIL}`,
            state: {
                action: CONSTANTS.ACTION.ADD,
            },
        });
    };

    const onActionClick = async (actionType: string, index: number | string) => {
        if (actionType === CONSTANTS.ACTION.EDIT) {
            history.push({
                pathname: `${PROPERTY_MASTER_DETAIL}`,
                state: {
                    action: CONSTANTS.ACTION.EDIT,
                    id: index,
                },
            });
        }

        if (actionType === CONSTANTS.ACTION.DELETE) {
            setCurrentID(index);
            setRenderDeleteBox(true);
        }
    };

    const getList = async () => {
        const response = await propertyMasterList({
            limit,
            offset,
            filter_by: filterBy,
            search_term: search,
            start_date: moment(startDate).format(DATE_FORMAT.SEARCH_DATE_FORMAT),
            end_date: moment(endDate).format(DATE_FORMAT.SEARCH_DATE_FORMAT),
        });
        if (response.status === 200) {
            setTotalCount(response.totalRecord);
            setData(response.data);
        } else {
            setTotalCount(0);
            setData([]);
        }
    };

    useEffect(() => {
        getList();
    }, []);

    useEffect(() => {
        getList();
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
            const response = await deleteProperty({
                id: currentID,
                is_active: false,
            });
            if (response.status === 200) {
                setRenderDeleteBox(false);
            } else {
                setRenderDeleteBox(false);
                setPopupMessage({
                    show: true,
                    msg: 'Some Error Occured Please Try Again Later!'
                });
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
                    <Button buttonType="primary"
                        styleClass={styles.addVideoButton}
                        id={'addVideo'}
                        onClick={onAddClick}
                    >
                        Add Property
                    </Button>
                </div>
                <Table
                    headerData={headers}
                    data={data}
                    limit={limit}
                    totalRecords={totalCount}
                    currentPage={currentPage}
                    showViewAction={false}
                    onActionClick={onActionClick}
                    paginationButtonNo={3}
                    showActionColumn
                    showPagination
                    wrapCol
                    columnToWrap={[3]}
                    onPaginatonClick={onPaginatonClick}
                />
            </div>
            {renderDeleteBox && <Modal divId={'fullscreenModal'}>
                <div className={styles.deleteContainer}>
                    <h5>
                        Are you sure you want to delete this property?
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

export default Property;
