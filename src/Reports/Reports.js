import React, { useMemo } from 'react';
import IncomeExpenditureByMonthChart from './IncomeExpenditureByMonthChart/IncomeExpenditureByMonthChart';
import CumulativeSavingsChart from './CumulativeSavingsChart/CumulativeSavingsChart';
import ExpenditureByCategoryChart from './ExpenditureByCategoryChart/ExpenditureByCategoryChart';
import SavingTrajectoryChart from './SavingTrajectoryChart/SavingTrajectoryChart';
import IncomeByCategoryChart from './IncomeByCategoryChart/IncomeByCategoryChart';
import moment from 'moment';
import OverallExpenditureByCategoryChart from './OverallExpenditureByCategoryChart/OverallExpenditureByCategoryChart';
import OverallIncomeByCategoryChart from './OverallIncomeByCategoryChart/OverallIncomeByCategoryChart';

function Reports (props) {

    const currentSavings = getCurrentSavings();
    const savingGoal = getSavingGoal();
    const interestRate = getInterestRate();

    const monthlyBreakdown = useMemo(
      () => calculateIncomeAndExpenditureByMonth(props.transactions), [props.transactions]
    );
    const monthData = Array.prototype.concat.apply([], Array.from(monthlyBreakdown.values()).map(item => Array.from(item.values())));
    const periodSummary = useMemo(
      () => summariseMonthlyData(monthData, currentSavings, savingGoal), [monthData, currentSavings, savingGoal]
    );
    const savingsTrajectory = useMemo(
      () => calculateSavingTrajectoryByMonth(monthData, currentSavings), [monthData, currentSavings]
    );
    const categories = useMemo(
      () => extractTransactionCategories(props.transactions), [props.transactions]
    ); 

    const overallExpenditureByCategory = useMemo(
      () => generateOverallExpenditureByCategoryDatasets(props.transactions, categories), [props.transactions, categories]
    )

    const overallIncomeByCategory = useMemo(
      () => generateOverallIncomeByCategoryDatasets(props.transactions, categories), [props.transactions, categories]
    )

    const categoryExpenditureByMonth = useMemo(
      () => generateMonthlyCategoryDatasets(monthData, categories), [monthData, categories]
    );
    const categoryIncomeByMonth = useMemo(
      () => generateMonthlyIncomeCategoryDatasets(monthData, categories), [monthData, categories]
    );

    return <div className="reports-container">
              <h2>Reports</h2>
              <div className="transaction-list-controls">
                <form onSubmit={(e) => handleFormSubmit(e)} className="pure-form pure-form-stacked">
                  <div className="filter-control">
                    <label htmlFor="">Current balance (EUR)</label>
                    <input type="number" value={props.currentBalance} onChange={(e) => handleCurrentBalanceChange(e)}/>
                  </div>
                  <div className="filter-control">
                    <label htmlFor="">Other savings (EUR)</label>
                    <input type="number" value={props.otherSavingsBalance} onChange={(e) => handleOtherSavingsBalanceChange(e)}/>
                  </div>
                  <div className="filter-control">
                    <label htmlFor="">Saving goal (EUR)</label>
                    <input type="number" value={props.savingGoal} onChange={(e) => handleSavingGoalChange(e)}/>
                  </div>
                  <div className="filter-control">
                    <label htmlFor="">Interest rate (%)</label>
                    <div className="interest-rate-slider">
                      <input type="range" min="0" max="100" step="1" value={props.interestRate} onChange={(e) => handleInterestRateChange(e)}/>
                      <div className="rate-display">{props.interestRate}%</div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="chart-panel">
                <h4>Saving summary</h4>
                <div className="stat-container">
                  <div className="stat-section">
                    <div className="stat-number">EUR {periodSummary.totalSaving}</div>
                    <div className="stat-text">Saved during period</div>
                  </div>
                  <div className="stat-section">
                    <div className="stat-number">EUR {periodSummary.averageSaving}</div>
                    <div className="stat-text">Average monthly saving</div>
                  </div>
                  <div className="stat-section">
                    <div className="stat-number">{periodSummary.percentSaved} %</div>
                    <div className="stat-text">Towards savings target</div>
                  </div>
                </div>
              </div>

              <IncomeExpenditureByMonthChart data={monthData}/>

              <CumulativeSavingsChart  data={savingsTrajectory}/>

              <SavingTrajectoryChart 
                data={monthData} 
                currentBalance={currentSavings + periodSummary.totalTransferred}
                savingGoal={savingGoal}
                interestRate={interestRate}
              />
              <OverallExpenditureByCategoryChart data={overallExpenditureByCategory}></OverallExpenditureByCategoryChart>
              <ExpenditureByCategoryChart data={categoryExpenditureByMonth}/>
              <OverallIncomeByCategoryChart data={overallIncomeByCategory}/>
              <IncomeByCategoryChart data={categoryIncomeByMonth}/>
            </div>

  function handleSavingGoalChange(event) {
    event.preventDefault();
    const goalAsNumber = Number(event.target.value);
    if (!isNaN(goalAsNumber) || goalAsNumber === "") {
      props.setSavingGoal(event.target.value);
    }
  }

  function handleFormSubmit(event) {
    event.preventDefault();
  }

  function handleCurrentBalanceChange(event) {
    event.preventDefault();
    const balanceAsNumber = Number(event.target.value);
    if (!isNaN(balanceAsNumber) || balanceAsNumber === "") {
      props.setCurrentBalance(event.target.value);
    }      
  }

  function handleOtherSavingsBalanceChange(event) {
    event.preventDefault();
    const balanceAsNumber = Number(event.target.value);
    if (!isNaN(balanceAsNumber) || balanceAsNumber === "") {
      props.setOtherSavingsBalance(event.target.value);
    }      
  }

  function handleInterestRateChange(event) {
    event.preventDefault();
    const rateAsNumber = Number(event.target.value);
    if (!isNaN(rateAsNumber) || rateAsNumber === "") {
      props.setInterestRate(event.target.value);
    }      
  }

  function getCurrentSavings() {
    const accountSavings = isNaN(parseFloat(props.currentBalance)) ? 0 : parseFloat(props.currentBalance);
    const otherSavings = isNaN(parseFloat(props.otherSavingsBalance)) ? 0 : parseFloat(props.otherSavingsBalance);
    return accountSavings + otherSavings;
  }

  function getSavingGoal() {
    return isNaN(parseFloat(props.savingGoal)) ? 0 : parseFloat(props.savingGoal);
  }

  function getInterestRate() {
    return isNaN(parseFloat(props.interestRate)) ? 0 : parseFloat(props.interestRate);
  }
}

function calculateIncomeAndExpenditureByMonth(transactions) {
  const reducer = (accumulator, current) => {
    
      const month = moment(current.bookingDate).month();
      const year =  moment(current.bookingDate).year();
      const amount = parseFloat(current.amount);
      const isSaving = current.isSaving;
      const transferred = isSaving
      ? round((0.00 - amount), 2)
      : 0.00
      let newMonthValue;
      if (accumulator.get(year)) {
        const accYear = accumulator.get(year);
        if (accYear.get(month)) {
          const previousMonth = accYear.get(month);
          const previousIncome = previousMonth.income;
          const previousExpenditure = previousMonth.expenditure;
          const previousTotal = previousMonth.total;
          const newTransactions = previousMonth.transactions.concat([current])
          if(isSaving){
            const previousTransferred = previousMonth.transferred;
            newMonthValue = {...previousMonth, transferred: round((previousTransferred + transferred), 2), transactions: newTransactions};
          }
          else if (amount >= 0.00) {
            newMonthValue = {...previousMonth, income: round((previousIncome + amount), 2), total: round((previousTotal + amount), 2), transactions: newTransactions};
          }
          else {
            newMonthValue = {...previousMonth, expenditure: round((previousExpenditure + amount), 2), total: round((previousTotal + amount), 2), transactions: newTransactions};
          }
          
          accYear.set(month, newMonthValue);
        }
        else {
          if(isSaving){
            newMonthValue = {year: year, month: month, income: 0.00, expenditure: 0.00, total: 0.00, transactions: [current], transferred: transferred};
          }
          else if(amount >= 0.00) {
            newMonthValue = {year: year, month: month, income: amount, expenditure: 0.00, total: amount, transactions: [current], transferred: 0.00}
          }
          else {
            newMonthValue = {year: year, month: month, income: 0.00, expenditure: amount, total: amount, transactions: [current], transferred: 0.00}
          }
          accumulator.get(year).set(month, newMonthValue);
        }
      }
      else {
        if(isSaving){
          newMonthValue = {year: year, month: month, income: 0.00, expenditure: 0.00, total: 0.00, transactions: [current], transferred: transferred};
        }
        else if(amount >= 0.00) {
          newMonthValue = {year: year, month: month, income: amount, expenditure: 0.00, total: amount, transactions: [current], transferred: 0.00}
        }
        else {
          newMonthValue = {year: year, month: month, income: 0.00, expenditure: amount, total: amount, transactions: [current], transferred: 0.00}
        }
        accumulator.set(year, new Map());
        accumulator.get(year).set(month, newMonthValue);
      }
      return accumulator
  }

  const result = transactions.reduce(reducer, new Map());
  return result;
}

function summariseMonthlyData(monthData, currentBalance, savingGoal) {
  const savingReducer = (accumulator, current, index) => {
    return accumulator + current.total
  }

  const transferredReducer = (accumulator, current, index) => {
    return accumulator + current.transferred
  }

  const totalSaving = monthData.reduce(savingReducer, 0.0).toFixed(2);
  const totalTransferred = monthData.reduce(transferredReducer, 0.0);
  const totalMonths = monthData.length;
  const averageSaving = monthData.length > 0 ? (totalSaving / totalMonths).toFixed(2) : 0.0;
  const percentSaved = savingGoal && currentBalance && savingGoal > 0.0 ? (((currentBalance + totalTransferred) / savingGoal) * 100).toFixed(1) : 0.0;
  return {totalSaving: totalSaving, averageSaving: averageSaving, percentSaved: percentSaved, totalTransferred: totalTransferred};
} 

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function calculateSavingTrajectoryByMonth(array, currentBalance) {

  const totalSavingsReducer = (accumulator, current) => {
    return accumulator + current.total;
  }

  const transferredReducer = (accumulator, current) => {
    return accumulator + current.transferred
  }

  const totalCumulativeSavings = array.reduce(totalSavingsReducer, 0.00);
  const totalTransferred = array.reduce(transferredReducer, 0.0);

  const floatValue = round((currentBalance - totalCumulativeSavings + totalTransferred), 2);

  const reducer = (accumulator, current, index) => {
    if (accumulator.length === 0) {
        return accumulator.concat([{year: current.year, month: current.month, savedTotal: round((current.total + floatValue), 2)}]);
    }
    else {
        const previousSaved = accumulator[accumulator.length-1].savedTotal;
        return accumulator.concat([{year: current.year, month: current.month, savedTotal: round((previousSaved + current.total), 2)}]);
    }
  }
  return array.reduce(reducer, [])
}

function extractTransactionCategories(transactions) {
  const categoryReducer = (acc, current) => {
      if(!acc.find((item) => {return item === current.category})) {
        return acc.concat([current.category]);
      }
      else {
        return acc;
      }
    };

    const categoryList = transactions.reduce(categoryReducer, []).sort();
    return categoryList;
}

function convertCategoriesToMap(categories) {
  const cats = categories.map((category) => {return [category, 0.00]});
  return new Map(cats);
}



function calculateCategoryExpenditureTotals(transactions, categories) {
  const reducer = (accumulator, current) => {
    if (accumulator.has(current.category)) {
      if(current.amount < 0 && !current.isSaving) {
        const oldTotal = parseFloat(accumulator.get(current.category));
        const newTotal = oldTotal + parseFloat(current.amount);
        accumulator.set(current.category, newTotal);
      }
      return accumulator;
    }
    else {
      return accumulator;
    }
  }
  const initialValue = convertCategoriesToMap(categories);
  return transactions.reduce(reducer, initialValue);
}

function generateMonthlyCategoryBreakdown(transactionsByMonth, categories) {
  return transactionsByMonth.map((month) => {
    return calculateCategoryExpenditureTotals(month.transactions, categories);
  });
}

function generateMonthlyCategoryDatasets (transactionsByMonth, categories) {
  const monthlyCategories = generateMonthlyCategoryBreakdown(transactionsByMonth, categories);

  const montlyTotaller = (accumulator, current) => {
    return accumulator + current;
  }

  const categoryDatasets = categories.map((category) => {
    const data = monthlyCategories.map(monthlyBreakdown => (0.0 - monthlyBreakdown.get(category)))
    return {category: category, data: data, total: data.reduce(montlyTotaller, 0.0), noExpenditures: data.every(dataPoint => (dataPoint === 0))};
  })

  const filteredCategoryDatasets = categoryDatasets.filter(item => {
    return !item.noExpenditures;
  })

  const months = transactionsByMonth.map(month => ((month.month + 1) + " " + month.year));

  return {months: months, datasets: filteredCategoryDatasets.sort((a, b) => {
    return b.total - a.total;
  })};
}

function generateOverallExpenditureByCategoryDatasets(transactions, categories) {

  const totals = Array.from(calculateCategoryExpenditureTotals(transactions, categories).entries())
  .sort((a, b) => {return a[1] - b[1]});

  return totals;
}

function generateOverallIncomeByCategoryDatasets(transactions, categories) {

  const totals = Array.from(calculateCategoryIncomeTotals(transactions, categories).entries())
  .filter(item => item[1] > 0)
  .sort((a, b) => {return b[1] - a[1]});

  return totals;
}

function calculateCategoryIncomeTotals(transactions, categories) {
  const reducer = (accumulator, current) => {
    if (accumulator.has(current.category)) {
      if(current.amount > 0) {
        const oldTotal = parseFloat(accumulator.get(current.category));
        const newTotal = oldTotal + parseFloat(current.amount);
        accumulator.set(current.category, newTotal);
      }
      return accumulator;
    }
    else {
      return accumulator;
    }
  }
  const initialValue = convertCategoriesToMap(categories);
  return transactions.reduce(reducer, initialValue);
}

function generateMonthlyIncomeCategoryBreakdown(transactionsByMonth, categories) {
  return transactionsByMonth.map((month) => {
    return calculateCategoryIncomeTotals(month.transactions, categories);
  });
}

function generateMonthlyIncomeCategoryDatasets (transactionsByMonth, categories) {
  const monthlyCategories = generateMonthlyIncomeCategoryBreakdown(transactionsByMonth, categories);

  const montlyTotaller = (accumulator, current) => {
    return accumulator + current;
  }

  const categoryDatasets = categories.map((category) => {
    const data = monthlyCategories.map(monthlyBreakdown => (monthlyBreakdown.get(category)))
    return {category: category, data: data, total: data.reduce(montlyTotaller, 0.0), noExpenditures: data.every(dataPoint => (dataPoint === 0))};
  })

  const filteredCategoryDatasets = categoryDatasets.filter(item => {
    return !item.noExpenditures;
  })

  const months = transactionsByMonth.map(month => ((month.month + 1) + " " + month.year));

  return {months: months, datasets: filteredCategoryDatasets.sort((a, b) => {
    return b.total - a.total;
  })};
}

export default Reports;
