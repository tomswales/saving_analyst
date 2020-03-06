import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js';
import regression from 'regression';

function SavingTrajectoryChart (props) {

  const savingTrajectoryCanvas = useRef(null);
  const savedChart = useRef(null);
  
  useEffect(() => {
    if(savedChart.current){
      savedChart.current.destroy();
    }
    const data = generateSavingsProjection(props.data, props.currentBalance, props.savingGoal, props.interestRate)
    const canvas = savingTrajectoryCanvas.current;
    const labels = data.map(item => ("Year " + item.year));
    const savingGoal = props.savingGoal;
    if(props.savingGoal) {
      renderChart(data, canvas, labels, savingGoal, savedChart, props.interestRate)
    }
  });

    return    <div className="chart-panel">
                <h4>Savings Projection</h4>
                <div className="chart-container">
                  {props.savingGoal
                    ? <canvas ref={savingTrajectoryCanvas}></canvas>
                    : <div>You need to provide a saving goal</div>
                  }
                </div>
              </div>

}

function renderChart(data, canvas, labels, savingGoal, savedChart, interestRate) {
    const datasets = [
        {
            label: 'Projected savings',
            data: data.map(item => item.balance),
            backgroundColor: '#000000',
            borderColor: '#000000',
            type: 'line',
            pointRadius: 3,
            fill: false,
            lineTension: 0
        }, 
        {
            label: `With ${interestRate}% interest`,
            data: data.map(item => item.balanceWithInterest),
            backgroundColor: '#D3D3D3',
            borderColor: '#D3D3D3',
            type: 'line',
            pointRadius: 3,
            fill: false,
            lineTension: 0
        }, 
        {
            label: 'Savings goal',
            data: data.map(item => savingGoal),
            borderColor: '#ff0000',
            backgroundColor: '#ff0000',
            type: 'line',
            fill: false,
            pointRadius: 0
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
                        beginAtZero:true,
                        max: Math.round((parseFloat(savingGoal) * 1.1))
                    }
                }]
            },
            maintainAspectRatio: false,
            responsive: true,
            animation: false
        }
      });

      savedChart.current = chart;
}

// Generate chart data for future projected saving
function generateSavingsProjection(data, currentBalance, savingGoal, interestRate) {

  const maxYears = 50;

  const regression = generateSavingsRegression(data);

  const savingRate = regression.equation[0] * 12;
  const result = project(currentBalance, savingRate, maxYears, savingGoal, interestRate);
  return result;
}

// Linear regression on the current cumulative savings trend
function generateSavingsRegression (data) {
  const accumulateReducer = (accumulator, current) => {
    let newTotal;
    if (accumulator.length > 0) {
      newTotal = accumulator[accumulator.length - 1] + current.total;
      return accumulator.concat([newTotal]);
    }
    else {
      return accumulator.concat([current.total]);
    }
  };
  const cumulativeSavings = data.reduce(accumulateReducer, [0.0])
  const dataForRegression = cumulativeSavings.map((item, index) => {
    return [index, item]
  });
  const result = regression.linear(dataForRegression);
  return result;
}

// Recursive function to project when cumulative savings will exceed target, given trend
function project(balance, savingRate, maxYears, savingGoal, interestRate) {
  const counter = 0;
  const interestPercentage = interestRate === 0 ? 0 : (interestRate / 100);
  const result = [{year: counter, balance: balance, balanceWithInterest: balance}];
  return projectHelper(balance, balance, savingRate, maxYears, savingGoal, interestPercentage, counter, result);
}

function projectHelper(balance, balanceWithInterest, savingRate, maxYears, savingGoal, interestPercentage, counter, result) {
  if(counter === maxYears || balance > savingGoal) {
    return result;
  }
  else {
    const newBalance = balance + savingRate;
    const newBalanceWithInterest = Math.round(balanceWithInterest + (balanceWithInterest * interestPercentage) + savingRate);

    const newCounter = counter + 1;
    const newResult = result.concat({year: newCounter, balance: newBalance, balanceWithInterest: newBalanceWithInterest});
    return projectHelper(newBalance, newBalanceWithInterest, savingRate, maxYears, savingGoal, interestPercentage, newCounter, newResult);
  }
}


export default SavingTrajectoryChart;
