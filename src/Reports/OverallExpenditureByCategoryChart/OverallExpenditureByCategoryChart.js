import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js';
import * as palette from 'google-palette';

function OverallExpenditureByCategoryChart (props) {

  const expenditureByCategoryCanvas = useRef(null);
  const savedChart = useRef(null);
  
  useEffect(() => {
      if(savedChart.current){
        savedChart.current.destroy();
      }
      const canvas = expenditureByCategoryCanvas.current;
      const labels = props.data.map(item => item[0]);
      const colors = palette('mpn65', 50);

      const dataset = {
            label: "Overall expenditure",
            data: props.data.map(item => item[1]),
            backgroundColor: colors.map(color => "#" + color)
      }

      const ctx = canvas.getContext('2d');
      // eslint-disable-next-line
      const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [dataset]
        }
       });

      savedChart.current = chart;
  });

  return    <div className="chart-panel">
              <h4>Overall expenditure by category</h4>
              <div className="chart-container double">
                <canvas ref={expenditureByCategoryCanvas}></canvas>
              </div>
            </div>
}

export default OverallExpenditureByCategoryChart;
