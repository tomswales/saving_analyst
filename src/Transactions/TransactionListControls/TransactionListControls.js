import React, { useRef } from 'react';
import Chance from 'chance';

function TransactionListControls (props) {

    const importCategoryMappingRef = useRef(null);
    const chance = new Chance();

    return (
      <div className="transaction-list-controls-container">
            <div className="transaction-list-controls">
              <button className="pure-button pure-button-primary transaction-control-button" onClick={(e) => handleClearTransactionsClick(e)}>Clear transactions</button>
              <button className="pure-button pure-button-primary transaction-control-button" onClick={(e) => handleExportCategoriesClick(e)}>Export transaction categories</button>
              <input className="hidden-input" onChange={(e) => handleCategoryMappingImportInputChange(e)} ref={importCategoryMappingRef} type="file" accept=".json"/>
              <button className="pure-button pure-button-primary transaction-control-button" onClick={(e) => handleImportCategoriesClick(e)}>Import transaction categories</button>
            </div>
            <div className="transaction-list-controls">
              <form onSubmit={(e) => handleFormSubmit(e)} className="pure-form pure-form-stacked">
                <div className="filter-control">
                  <label htmlFor="">Show only uncategorised</label>
                  <input type="checkbox" checked={props.filterClassified} onChange={(e) => handleFilterClassifiedChange(e)}/>
                </div>
                {props.filterClassified 
                  ? null
                  : <div className="filter-control">
                      <label htmlFor="">Filter by category</label>
                      <select value={props.filterByCategory} onChange={(e) => handleFilterCategoryChange(e)}>
                          <option value="">None</option>
                          {props.categoryList.map(item => <option key={chance.string({length: 16})} value={item}>{item}</option>)}
                      </select>
                    </div>
                }
                <div className="filter-control">
                  <label htmlFor="">Filter by transaction type</label>
                  <select value={props.filterByTransactionType} onChange={(e) => handleFilterTransactionTypeChange(e)}>
                      <option value="">None</option>
                      <option value="Expenditure">Expenditure</option>
                      <option value="Income">Income</option>
                  </select>
                </div>
                <div className="filter-control">
                  <label htmlFor="">Filter by savings transfer</label>
                  <input type="checkbox" checked={props.filterBySavingsTransfer} onChange={(e) => handleFilterSavingsTransferChange(e)}/>
                </div>
              </form>
            </div>
          </div>
    );

  function handleCategoryMappingImportInputChange(event) {
    const files = event.target.files;
    if (files && files.length > 0) {
      props.importCategoryMappings(files[0]);
    }
  }

  function handleClearTransactionsClick(event) {
    event.preventDefault();
    props.clearTransactions();
  }

  function handleExportCategoriesClick(event) {
    event.preventDefault();
    props.generateCategoryMapping();
  }

  function handleImportCategoriesClick(event) {
    event.preventDefault();
    importCategoryMappingRef.current.click();
  }

  function handleFilterClassifiedChange(event) {
    props.setFilterClassified(event.target.checked);
  }

  function handleFilterCategoryChange(event) {
    props.setCategoryFilter(event.target.value);
  }

  function handleFilterTransactionTypeChange(event) {
    props.setTransactionTypeFilter(event.target.value);
  }

  function handleFilterSavingsTransferChange(event) {
    props.setSavingsTransferFilter(event.target.checked);
  }

  function handleFormSubmit(event) {
    event.preventDefault();
  }
}

export default TransactionListControls;
