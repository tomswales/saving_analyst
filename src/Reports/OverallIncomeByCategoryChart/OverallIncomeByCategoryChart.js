import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js';
import * as palette from 'google-palette';

function OverallIncomeByCategoryChart (props) {

  const incomeByCategoryCanvas = useRef(null);
  const savedChart = useRef(null);
  
  useEffect(() => {
      if(savedChart.current){
        savedChart.current.destroy();
      }
      const canvas = incomeByCategoryCanvas.current;
      const labels = props.data.map(item => item[0]);
      const colors = palette('mpn65', 50);

      const dataset = {
            label: "Overall income",
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
              <h4>Overall income by category</h4>
              <div className="chart-container double">
                <canvas ref={incomeByCategoryCanvas}></canvas>
              </div>
            </div>
}

export default OverallIncomeByCategoryChart;
