import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js';

function IncomeExpenditureByMonthChart (props) {

  const incomeExpenditureByMonthCanvas = useRef(null);
  const savedChart = useRef(null);
  
  useEffect(() => {
      if(savedChart.current){
        savedChart.current.destroy();
      }

      const canvas = incomeExpenditureByMonthCanvas.current;

      const labels = props.data.map(month => ((month.month + 1) + " " + month.year));

      const datasets = [{
            label: 'Income',
            data: props.data.map(item => item.income),
            backgroundColor: '#000000'
        }, 
        {
            label: 'Expenditure',
            data: props.data.map(item => item.expenditure),
            backgroundColor: '#ff0000'
        }, 
        {
            label: 'Net savings',
            data: props.data.map(item => item.total),
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
                <h4>Income versus Expenditure by Month</h4>
                <div className="chart-container">
                  <canvas ref={incomeExpenditureByMonthCanvas}></canvas>
                </div>
              </div>
}

export default IncomeExpenditureByMonthChart;
