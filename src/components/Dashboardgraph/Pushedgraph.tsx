const Pushed: any = {
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
      label: 'Video Pushed',
      data: [30, 20, 32, 58, 52, 19, 25, 35, 51, 54, 76, 40],
      fill: true,
      borderColor: 'rgba(190, 2, 3, 1)',
      tension: 0.4,
      borderWidth: 2,
      opacity: 1,
      backgroundColor: ['rgba(190, 2, 3, 0.2)',
                        'rgba(255,255,255,0.2)']
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
export default Pushed;
