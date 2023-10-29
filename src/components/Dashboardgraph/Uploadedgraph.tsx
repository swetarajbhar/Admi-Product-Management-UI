const Uploaded: any = {

  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Video Uploaded',
      data: [33, 53, 40, 41, 44, 65, 70, 42, 54, 69, 52, 50],
      fill: true,
      borderColor: 'rgba(85, 216, 254, 1)',
      tension: 0.4,
      opacity: 1,
      borderWidth: 2,
      backgroundColor: ['rgba(85, 216, 254, 0.2)',
        'rgba(255,255,255,0.2)',
      ]
    }
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
          boxHeight: 10
        },
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Months'
         
        },
        ticks: {
          fontSize: 40,
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Video Counts'
        }
      }
    }
  }
};
export default Uploaded;