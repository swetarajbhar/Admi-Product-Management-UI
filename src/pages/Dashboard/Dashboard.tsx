import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import Select, { OptionTypeBase } from 'react-select';
import { getDashboardCardData } from '../../api/dashboard';
import { propertyList } from '../../api/property';
import { ReactComponent as SearchIcon } from '../../assets/SVG/calendar.svg';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Card from '../../components/Card/card';
import DashboardGraph from '../../components/Dashboardgraph/Dashboardgraph';
import CONSTANTS from '../../constants/constants';
import LOCALSTORAGE from '../../constants/LOCALSTORAGE';
import TStandardObject from '../../types/StandardObject';
import styles from './Dashboard.module.scss';

const Dashboard: React.FC = () => {

  const [startDate, setStartDate] = useState<Date>(new Date('01/01/2021'));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [property, setProperty] = useState<OptionTypeBase | null>(null);
  const [propertyData, setPropertyData] = useState<Array<TStandardObject>>([]);
  const [dashboardCardData, setDashboardCardData] = useState({
    totalVideoUploaded: '0',
    totalTranscodedVideo: '0',
    totalEditedVideo: '0',
    totalVideoPushed: '0',
  });

  // useEffect(() => {
  //   if (document.getElementById('header') === null) {
  //     // window.location.reload();
  //   } else {
  //     const propData = JSON.parse(localStorage[LOCALSTORAGE.PROPERTY]);
  //     if(propData && propData[0] !== null) {
  //       setPropertyData(propData);
  //       setProperty(propData[0]);
  //     }
  //   }
  // }, []);

  useEffect(() => {
    getDashboardCardData({
      start_date: startDate,
      end_date: endDate,
      property_name: property?.value || ''
    })
      .then((res) => {
        setDashboardCardData({ ...res });
      });
  }, [startDate, endDate, property]);

  const onPropertyChange = (e: any) => {
    setProperty(e);
  };

  if (document.getElementById('header') === null) return null;
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Breadcrumb />
        <div>
          <Select
            closeMenuOnSelect
            onChange={onPropertyChange}
            value={property}
            placeholder="Select Property"
            options={propertyData}
          />
        </div>
        <div className={styles.datePickerWrapper}>
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => date && setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat={CONSTANTS.DATE_FORMAT}
            placeholderText={CONSTANTS.DATE_PLACEHOLDER}
            className={`${styles.startDate} ${styles.datepickerInput}`}
            maxDate={new Date()}
          />
          <span style={{ paddingRight: '0.8em' }}>-</span>
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => date && setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            maxDate={new Date()}
            dateFormat={CONSTANTS.DATE_FORMAT}
            placeholderText={CONSTANTS.DATE_PLACEHOLDER}
            className={styles.datepickerInput}
          />
          <SearchIcon className={styles.calendarIcon} />
        </div>
      </div>
      <div className={styles.gridContainer}>
        <div className={styles.gridItem}>
          <Card
            title={'Total Videos Uploaded'}
            value={dashboardCardData.totalVideoUploaded}
            remaining={23}
            description={'Yet to be Uploaded'}
          />
        </div>
        <div className={styles.gridItem}>
          <Card
            title={'Total Videos Transcoded'}
            value={dashboardCardData.totalTranscodedVideo}
            remaining={23}
            description={'Yet to be Transcoded'}
          />
        </div>
        <div className={styles.gridItem}>
          <Card
            title={'Total Videos Edited'}
            value={dashboardCardData.totalEditedVideo}
            remaining={23}
            description={'Yet to be Edited'}
          />
        </div>
        <div className={styles.gridItem}>
          <Card
            title={'Total Videos Pushed'}
            value={dashboardCardData.totalVideoPushed}
            remaining={23}
            description={'Yet to be Pushed'}
          />
        </div>
      </div>
      <div>
        <DashboardGraph propertyName={property?.value} />
      </div>
    </div>
  );
};

export default Dashboard;
