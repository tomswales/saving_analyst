import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js';
import * as palette from 'google-palette';

function ExpenditureByCategoryChart (props) {

  const expenditureByCategoryCanvas = useRef(null);
  const savedChart = useRef(null);
  
  useEffect(() => {
      if(savedChart.current){
        savedChart.current.destroy();
      }
      const canvas = expenditureByCategoryCanvas.current;
      const labels = props.data.months;
      const colors = palette('mpn65', 50);

      const datasets = props.data.datasets.map((item, index) => {
        return {
            label: item.category,
            data: item.data,
            backgroundColor: ('#' + colors[index % 50])
        }
      })

      const ctx = canvas.getContext('2d');
      // eslint-disable-next-line
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: datasets
        },
        options: {
            scales: {
              xAxes: [{
                  stacked: true
              }],
              yAxes: [{
                  stacked: true
              }]
            },
            maintainAspectRatio: false,
            responsive: true
        }
       });

      savedChart.current = chart;
  });

  return    <div className="chart-panel">
              <h4>Expenditure by category</h4>
              <div className="chart-container double">
                <canvas ref={expenditureByCategoryCanvas}></canvas>
              </div>
            </div>
}

export default ExpenditureByCategoryChart;
