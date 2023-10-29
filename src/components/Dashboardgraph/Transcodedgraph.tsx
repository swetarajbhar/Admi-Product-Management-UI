const Transcoded: any = {
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
      label: 'Video Transcoded',
      data: [33, 25, 35, 51, 54, 76, 40, 41, 44, 65, 70, 42, 54],
      fill: true,
      borderColor: 'rgba(33, 213, 155, 1)',
      tension: 0.4,
      borderWidth: 2,
      opacity: 1,
      backgroundColor: ['rgba(33, 213, 155, 0.2)',
        'rgba(255,255,255,0.2)',
      ],
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
        ticks: {
          fontSize: 40,
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
export default Transcoded;
