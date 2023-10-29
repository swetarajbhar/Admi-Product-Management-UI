import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { getRecentActivityList } from '../../api/recentActivity';
import { ReactComponent as CalendarIcon } from '../../assets/SVG/calendar.svg';
import Entry from '../../components/Entry/Entry';
import Table from '../../components/Table/Table';
import CONSTANTS from '../../constants/constants';
import DATE_FORMAT from '../../constants/DATE_FORMAT';
import styles from './Recentactivity.module.scss';


interface TableData {
  [key: string]: string | number | undefined | null;
}

const headers = [
  'Video ID',
  'Video Name',
  'Property Name',
  'Status',
];

const limit = 10;
const initialStartDate = new Date();
initialStartDate.setDate(1);

const RecentActivity = (): JSX.Element => {
  const [data, setData] = useState<Array<TableData>>([]);
  const [filterBy, setFilterBy] = useState<string>(CONSTANTS.FILTER_BY.DATE_RANGE);
  const [search, setSearch] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(initialStartDate);
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getRecentActivityList({
      limit: 10,
      offset,
      filter_by: filterBy,
      start_date: startDate,
      end_date: endDate,
      search_term: search,
    })
      .then((res) => {
        setData(res.data || []);
        setTotalCount(res.totalRecord);
      }).catch((err) => {
        console.error('err', err);
      });
  }, [startDate, endDate, offset, search]);


  const onMenuClick = (value: string) => {
    setSearch(value);
    setFilterBy(CONSTANTS.FILTER_BY.SEARCH_TEXT);
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

  const dateSearch = (dateType: string, date: Date) => {
    setOffset(0);
    setCurrentPage(1);
    dateType === 'startDate' && setStartDate(date);
    dateType === 'endDate' && setEndDate(date);
    setFilterBy(CONSTANTS.FILTER_BY.DATE_RANGE);
  };


  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.heading}>
            Recent Activity
          </div>
          <Entry
            id="search"
            styleClass={styles.searchBar}
            value={search}
            onChange={(e) => { onSearch(e.target.value); }}
          />
          <div className={styles.datePickerWrapper}>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) =>
                date && dateSearch('startDate', date)
              }
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat={DATE_FORMAT.SHORT_DATE_FORMAT}
              placeholderText={DATE_FORMAT.STANDARD_DATE_FORMAT}
              className={`${styles.startDate} ${styles.datepickerInput}`}
            />
            <span style={{ paddingRight: '0.8em' }}>-</span>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) =>
                date && dateSearch('endDate', date)
              }
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat={DATE_FORMAT.SHORT_DATE_FORMAT}
              placeholderText={DATE_FORMAT.STANDARD_DATE_FORMAT}
              className={styles.datepickerInput}
            />
            <CalendarIcon className={styles.calendarIcon} />
          </div>

        </div>
        <Table
          headerData={headers}
          data={data}
          limit={limit}
          onMenuClick={onMenuClick}
          onPaginatonClick={onPaginatonClick}
          paginationButtonNo={3}
          showPagination
          currentPage={currentPage}
          totalRecords={totalCount}
          wrapCol
          columnToWrap={[1]}
          redirectOnStatusClick
        />
      </div>
    </>
  );
};

export default RecentActivity;
