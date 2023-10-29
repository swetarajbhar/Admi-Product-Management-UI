import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Select from 'react-select';
import { getDashboardGraphData } from '../../api/dashboard';
import TStandardObject from '../../types/StandardObject';
import styles from './Dashboardgraph.module.scss';

type TVideoStateFilter = 'all' | 'uploaded' | 'transcoded' | 'pushed';

interface DashboardGraphProps {
  propertyName: string;
}

const generateGraphData = (data: TStandardObject, filterType: TVideoStateFilter = 'all') => {
  const { total_video_uploaded = [], total_video_pushed = [], total_transcoded_video = [] } = data;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const uploadedDataset = {
    label: 'Video Uploaded',
    data: total_video_uploaded.map((x: TStandardObject) => x.count),
    fill: true,
    borderColor: 'rgba(85, 216, 254, 1)',
    tension: 0.4,
    opacity: 1,
    borderWidth: 2,
    backgroundColor: ['rgba(85, 216, 254, 0.2)', 'rgba(255,255,255,0.2)'],
  };

  const transcodedDataset = {
    label: 'Video Transcoded',
    data: total_transcoded_video.map((x: TStandardObject) => x.count),
    fill: true,
    borderColor: 'rgba(33, 213, 155, 1)',
    tension: 0.4,
    borderWidth: 2,
    opacity: 1,
    backgroundColor: ['rgba(33, 213, 155, 0.2)'],
  };

  const pushedDataset = {
    label: 'Video Pushed',
    data: total_video_pushed.map((x: TStandardObject) => x.count),
    fill: true,
    borderColor: 'rgba(190, 2, 3, 1)',
    tension: 0.4,
    borderWidth: 2,
    opacity: 1,
    backgroundColor: ['rgba(190, 2, 3, 0.1)', 'rgba(255,255,255,0.1)'],
  };

  const _data = {
    labels: months,
    datasets: [uploadedDataset, transcodedDataset, pushedDataset]
  };

  if (filterType === 'uploaded') {
    _data.datasets = [uploadedDataset];
  }
  if (filterType === 'pushed') {
    _data.datasets = [pushedDataset];
  }
  if (filterType === 'transcoded') {
    _data.datasets = [transcodedDataset];
  }
  return _data;
};

const DashboardGraph = ({ propertyName = '' }: DashboardGraphProps): JSX.Element => {

  const [videoStateFilter, setVideoStateFilter] = useState<TVideoStateFilter>('all');
  const [yearData, setYearData] = useState<Array<TStandardObject>>(() => {
    const max = new Date().getFullYear();
    const years = [];
    for (let i = max; i >= 2020; i--) {
      const obj = { label: i.toString(), value: i.toString() };
      years.push(obj);
    }
    return years;
  });
  const [year, setYear] = useState(yearData[0]);
  const [totalGraphData, setTotalGraphData] = useState<any>({});

  useEffect(() => {
    getDashboardGraphData({
      property_name: propertyName,
      year: year.value
    }).then((x) => {
      setTotalGraphData(x.data);
    }).catch((err) => {
      console.error('err', err);
    });
  }, [year, propertyName]);


  const handleChange = (event: any) => {
    const { target: { value } } = event;
    setVideoStateFilter(value);
  };

  const onYearChange = (e: any) => {
    setYear(e);
  };

  const renderGraph = () => {
    const data = generateGraphData(totalGraphData, videoStateFilter);
    return <Line height={80} data={data} options={{
      plugins: {
        legend: {
          position: 'bottom',
          display: true,
          align: 'center',
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            font: {
              size: 14,
            },
          },
        },
      },
      scales: {
        x: {
          display: true,

          title: {
            display: true,
            text: ' Months',
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Video Counts',
          },
          min: 0,
          ticks: {
            stepSize: 1
          }
        },
      },
    }} />;
  };

  return (
    <div className={styles.container}>
      <div className={styles.Heading}>
        <h3>Updates</h3>
      </div>
      <div className={styles.Card}>
        <div className={styles.card_button}>
          <Select
            onChange={onYearChange}
            value={year}
            placeholder='Select Year'
            options={yearData}
            className={styles.yearDropdown}
          />
          <div className={styles.card_radio}>
            <input
              type='radio'
              className='circle'
              name='letter'
              value='all'
              checked={videoStateFilter === 'all'}
              onChange={(event) => handleChange(event)}
            />
            <p className={styles.card_radio_text}>All</p>
          </div>
          <div className={styles.card_radio}>
            <input
              type='radio'
              className='circle'
              name='letter'
              value='uploaded'
              checked={videoStateFilter === 'uploaded'}
              onChange={(event) => handleChange(event)}
            />
            <p className={styles.card_radio}>Video Uploaded</p>
          </div>
          <div className={styles.card_radio}>
            <input
              type='radio'
              className='circle'
              name='letter'
              value='transcoded'
              checked={videoStateFilter === 'transcoded'}
              onChange={(event) => handleChange(event)}
            />
            <p className={styles.card_radio}>Video Transcoded</p>
          </div>
          <div className={styles.card_radio}>
            <input
              type='radio'
              className='circle'
              name='letter'
              value='pushed'
              checked={videoStateFilter === 'pushed'}
              onChange={(event) => handleChange(event)}
            />
            <p className={styles.card_radio}>Video Pushed</p>
          </div>
        </div>
        <div className={styles.chartContainer}>
          <div className={styles.chartdata}>{renderGraph()}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGraph;
