import React, { useRef } from 'react';
import moment from 'moment';
import TransactionListControls from './TransactionListControls/TransactionListControls';
import TransactionList from './TransactionList/TransactionList';

function Transactions (props) {

  const uploadFileRef = useRef(null);
  const categoryList = generateCategoryListDynamically({transactions: props.transactions});
  const filteredTransactions = filterTransactions({transactions: props.transactions, filterClassified: props.filterClassified, filterByCategory: props.filterByCategory, filterByTransactionType: props.filterByTransactionType})
  const sortedTransactions = sortTransactions({sortBy: props.sortBy, transactions: filteredTransactions});

    return (
      <div className="transactions-container">
        <h2>Transactions</h2>
        {
          props.transactions.length > 0 
          ?
          <TransactionListControls 
            categoryList={categoryList}
            filterClassified={props.filterClassified}
            setCategoryFilter={props.setCategoryFilter}
            setTransactionTypeFilter={props.setTransactionTypeFilter}
            filterByCategory={props.filterByCategory}
            filterByTransactionType={props.filterByTransactionType}
            clearTransactions = {props.clearTransactions}
            generateCategoryMapping = {props.generateCategoryMapping}
            importCategoryMappings= {props.importCategoryMappings}
            setFilterClassified = {props.setFilterClassified}
          />
          :
          <div>
            <p>Import your transactions</p>
            <input className="hidden-input" onChange={(e) => handleImportInputChange(e)} ref={uploadFileRef} type="file" accept=".csv"/>
            <button className="pure-button pure-button-primary" onClick={(e) => handleImportButtonClick(e)}>Click to import</button>
          </div>
        }
        <TransactionList 
          sortedTransactions={sortedTransactions}
          setSortBy={props.setSortBy}
          sortBy={props.sortBy}
          displayLimit={props.displayLimit}
          transactionLength={props.transactions.length}
          deleteTransaction={props.deleteTransaction} 
          updateCategoryForMatchingItems={props.updateCategoryForMatchingItems}
          categoryList={categoryList}
          getPrediction={props.getPrediction}
        />
        {
          sortedTransactions.length > (props.displayLimit) 
          ? 
          <div className="more-button-container">
            <button className="pure-button pure-button-primary" onClick={(e) => handleShowMoreClick(e)}>Show more</button>
          </div>
          : 
          null
        }
      </div>
    );
  
  // Extracts alphabetical list of categories from the transaction list to build drop down options
  function generateCategoryListDynamically({transactions}) {
    const reducer = (acc, current) => {
      if(!acc.find((item) => {return item === current.category}) && current.category !== "Undefined") {
        return acc.concat([current.category]);
      }
      else {
        return acc;
      }
    };

    return transactions.reduce(reducer, []).sort();
  }

  // Apply transaction filters sequentially (if they are set)
  function filterTransactions({transactions, filterClassified, filterByCategory, filterByTransactionType}) {
    const filteredOutClassified = filterClassified ? transactions.filter((item) => {
      return item.category === "Undefined";
    }) : transactions;

    const filtererdByCategoryTransactions = filterByCategory !== "" ? filteredOutClassified.filter((item) => {
      return item.category === filterByCategory;
    }) : filteredOutClassified;

    const filteredByTypeTransactions = filterByTransactionType !== "" ? filtererdByCategoryTransactions.filter((item) => {
        if (filterByTransactionType === "Income") {
          return item["amount"] >= 0
        }
        else if (filterByTransactionType === "Expenditure") {
          return item["amount"] < 0
        }
        else {
          return item
        }
    }) : filtererdByCategoryTransactions;

    return filteredByTypeTransactions;
  }

  // Sort transactions according to date or amount criteria (ascending or descending)
  function sortTransactions({sortBy, transactions}) {
    return transactions.concat([]).sort((a, b) => {
    const dateA = moment(a.bookingDate);
    const dateB = moment(b.bookingDate);
    switch(props.sortBy) {
      case "DATE_ASC":
        if(dateA.isBefore(dateB)) {
          return -1;
        }
        else if(dateB.isBefore(dateA)) {
          return 1;
        }
        else {
          return 0;
        }
      case "DATE_DESC":
        if(dateB.isBefore(dateA)) {
          return -1;
        }
        else if(dateA.isBefore(dateB)) {
          return 1;
        }
        else {
          return 0;
        }
      case "AMT_ASC":
        return a.amount-b.amount;
      case "AMT_DESC":
        return b.amount-a.amount;
      default:
        return moment(b.bookingDate).utc();
    }
  })
  }

  // Click handler for the file import button (sends click to hidden file input)
  function handleImportButtonClick(event) {
    event.preventDefault();
    uploadFileRef.current.click();
  }

  // Handles CSV file upload
  function handleImportInputChange(event) {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileURL = window.URL.createObjectURL(files[0]);
      props.importTransactions(fileURL);
    }
  }

  // Handler for the button to show more transactions
  function handleShowMoreClick(event) {
    event.preventDefault();
    props.showMoreTransactions();
  }

}

export default Transactions;
