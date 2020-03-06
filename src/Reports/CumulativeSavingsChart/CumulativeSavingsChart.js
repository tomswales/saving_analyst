import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js';

function CumulativeSavingsChart (props) {

  const savingTrajectoryCanvas = useRef(null);
  const savedChart = useRef(null);

  useEffect(() => {
      if(savedChart.current){
        savedChart.current.destroy();
      } 
      const canvas = savingTrajectoryCanvas.current;
      const labels = props.data.map(month => ((month.month + 1) + " " + month.year));
      const datasets = [
        {
            label: 'Cumulative savings',
            data: props.data.map(item => item.savedTotal),
            backgroundColor: '#9b9b9b',
            type: 'line',
            pointRadius: 3
        }]
      const ctx = canvas.getContext('2d');
      // eslint-disable-next-line
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: datasets,
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            },
            maintainAspectRatio: false,
            responsive: true
        }
      });

      savedChart.current = chart;
    });

    return    <div className="chart-panel">
                <h4>Cumulative Savings</h4>
                <div className="chart-container">
                  <canvas ref={savingTrajectoryCanvas}></canvas>
                </div>
              </div>
}

export default CumulativeSavingsChart;
