const Data: any = {
  labels: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  datasets: [
    {
      label: 'Video Uploaded',
      data: [33, 53, 40, 41, 44, 65, 70, 42, 54, 69, 52, 120],
      fill: true,
      borderColor: 'rgba(85, 216, 254, 1)',
      tension: 0.4,
      opacity: 1,
      borderWidth: 2,
      backgroundColor: ['rgba(85, 216, 254, 0.2)', 'rgba(255,255,255,0.2)'],
    },
    {
      label: 'Video Transcoded',
      data: [33, 25, 35, 51, 54, 76, 40, 41, 120, 65, 70, 42, 90],
      fill: true,
      borderColor: 'rgba(33, 213, 155, 1)',
      tension: 0.4,
      borderWidth: 2,
      opacity: 1,
      backgroundColor: ['rgba(33, 213, 155, 0.2)'],
    },
    {
      label: 'Video Pushed',
      data: [30, 20, 32, 58, 52, 19, 25, 35, 51, 54, 76, 40],
      fill: true,
      borderColor: 'rgba(190, 2, 3, 1)',
      tension: 0.4,
      borderWidth: 2,
      opacity: 1,
      backgroundColor: ['rgba(190, 2, 3, 0.1)', 'rgba(255,255,255,0.1)'],
    },
  ],
  options: {
    plugins: {
      responsive: false,
      legend: {
        position: 'bottom',
        display: true,
        onClick: null,
        Align: 'center',
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
          text: 'Months',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Video Counts',
        },
      },
    },
  },
};
export default Data;
