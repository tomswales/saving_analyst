import React from 'react';
import CategoryEditor from './CategoryEditor/CategoryEditor';
import DeleteControl from './DeleteControl/DeleteControl';

function TransactionRow (props) {

    return (
      <div className="transaction-row">
        <DeleteControl 
            deleteTransaction={props.deleteTransaction}
            transactionId={props.transaction.id}
            stateOwner={props.stateOwner}/>
        <div className="transaction-data-container">
        	<div className="transaction-data-head">
        		<div className="transaction-data-head-item">
        			<div className="transaction-text">
                        <b>Counterparty</b>
                    </div>
                    <div className="transaction-text">
        			 {props.transaction["Beguenstigter/Zahlungspflichtiger"]}
                    </div>
        		</div>
        		<div className="transaction-data-head-item">
        			<div className="transaction-text">
        				<b>Amount</b>
        			</div>
        			<div className={props.transaction["amount"] >= 0 ? "transaction-text" : "transaction-text negative"}>
        				{props.transaction["Waehrung"]}: {props.transaction["amount"]}
        			</div>
        		</div>
        	</div>
        	<div  className="transaction-data-body">
        		<div className="transaction-data-body-item">
        			<div className="transaction-data-body-label">
        				<b>Date</b>
        			</div>
        			<div className="transaction-text">
        				{props.transaction["Buchungstag"]}
        			</div>
        		</div>
        		<div className="transaction-data-body-item">
        			<div className="transaction-data-body-label">
        				<b>IBAN</b>
        			</div>
        			<div className="transaction-text">
        				{props.transaction["Kontonummer/IBAN"]}
        			</div>
        		</div>
        		<div className="transaction-data-body-item">
        			<div className="transaction-data-body-label">
        				<b>Transaction type</b>
        			</div>
        			<div className="transaction-text">
        				{props.transaction["Buchungstext"]}
        			</div>
        		</div>
				<div className="transaction-data-body-item">
					{
						props.transaction["amount"] < 0
						? <div>
							<div className="transaction-data-body-label">
								<b>Savings</b>
							</div>
							<div className="transaction-text">
								<input type="checkbox" checked={props.transaction.isSaving} onChange={(e) => handleIsSavingChange(e, props.transaction.id)}/>
							</div>
						</div>
						: null
					}
        		</div>
        	</div>
        </div>
        <div className="transaction-category-container">
            <CategoryEditor 
                updateCategoryForMatchingItems={props.updateCategoryForMatchingItems}
                transaction={props.transaction} 
                category={props.transaction["category"]} 
                categoryList={props.categoryList}
                getPrediction={props.getPrediction}
            />
        </div>
      </div>
	);
	
	function handleIsSavingChange(e, id) {
		props.updateTransactionIsSaving(id, e.target.checked);
	}
}

export default TransactionRow;
