import React from 'react';
import TransactionRow from './TransactionRow/TransactionRow';
import SortMenu from './SortMenu/SortMenu';

function TransactionList (props) {

    return <div className="transaction-list">
          {props.sortedTransactions.length > 0 
            ? <SortMenu setSortBy={props.setSortBy} sortBy={props.sortBy}/>
            : null
          }
          {props.sortedTransactions.length > 0 
            ? <p>Displaying {props.sortedTransactions.slice(0, props.displayLimit).length} of {props.transactionLength} total transactions</p>
            : null
          }
          {props.sortedTransactions.slice(0, props.displayLimit).map((transaction) => {
              return <TransactionRow 
                updateTransactionIsSaving={props.updateTransactionIsSaving}
                deleteTransaction={props.deleteTransaction} 
                categoryList={props.categoryList} 
                key={transaction.id} 
                transaction={transaction}
                updateCategoryForMatchingItems={props.updateCategoryForMatchingItems}
                getPrediction={props.getPrediction}
              />
          })}
        </div>
  }

export default TransactionList;
