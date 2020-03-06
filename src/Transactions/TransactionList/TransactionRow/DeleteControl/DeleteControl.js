import React, { useState } from 'react';

function DeleteControl(props) {

  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="delete-control">
      {confirmDelete
          ? <div className="confirm-delete-container">
              <p><b>Delete?</b></p>
              <button 
                  onClick={(e) => handleConfirmDeleteButtonClick(e)} 
                  className="pure-button pure-button-primary">Yes</button>
               <button 
                  onClick={(e) => handleCancelDeleteButtonClick(e)} 
                  className="pure-button">No</button>
            </div>
          : <i onClick={(e) => handleDeleteIconClick(e)} 
              className="fas fa-times delete-icon">
              </i>
      }
    </div>
  );

  function handleDeleteIconClick(event) {
    setConfirmDelete(true);
  }

  function handleConfirmDeleteButtonClick(event) {
    event.preventDefault();
    props.deleteTransaction(props.transactionId);
    setConfirmDelete(false);
  }

  function handleCancelDeleteButtonClick(event) {
    event.preventDefault();
    setConfirmDelete(false);
  }
}

export default DeleteControl;
