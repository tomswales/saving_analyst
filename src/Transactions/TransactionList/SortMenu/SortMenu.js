import React from 'react';

function SortMenu (props) {

    return (
      <div className="pure-menu pure-menu-horizontal">
        <ul className="pure-menu-list">
            <li className="pure-menu-item">{renderDate()}</li>
            <li className="pure-menu-item">{renderAmount()}</li>
        </ul>
      </div>
    );

    function renderDate() {
      switch(props.sortBy) {
        case "DATE_ASC":
          return <div 
          onClick={() => props.sortBy !== "DATE_ASC" && props.sortBy !== "DATE_DESC" 
            ? props.setSortBy("DATE_ASC") 
            : props.setSortBy("DATE_DESC")
          } className="pure-menu-link pure-menu-selected">Date<span> <i className="fas fa-calendar-alt"/></span><span> <i className="fas fa-arrow-up"/></span></div>
        case "DATE_DESC":
          return <div onClick={() => props.sortBy !== "DATE_ASC" && props.sortBy !== "DATE_DESC" ? props.setSortBy("DATE_DESC") : props.setSortBy("DATE_ASC")} className="pure-menu-link pure-menu-selected">Date<span> <i className="fas fa-calendar-alt"/></span><span> <i className="fas fa-arrow-down"/></span></div>
        default:
          return <div onClick={() => props.sortBy !== "DATE_ASC" && props.sortBy !== "DATE_DESC" ? props.setSortBy("DATE_DESC") : props.setSortBy("DATE_DESC")} className="pure-menu-link">Date<span> <i className="fas fa-calendar-alt"/></span><span> <i className="fas fa-arrow-down"/></span></div>
      }
    }

    function renderAmount() {
       switch(props.sortBy) {
        case "AMT_ASC":
          return <div onClick={() => props.sortBy !== "AMT_ASC" && props.sortBy !== "AMT_DESC" 
            ? props.setSortBy("AMT_ASC") 
            : props.setSortBy("AMT_DESC")
          } className="pure-menu-link pure-menu-selected">Amount<span> <i className="fas fa-sort-amount-up"></i></span></div>
        case "AMT_DESC":
          return <div onClick={() => props.sortBy !== "AMT_ASC" && props.sortBy !== "AMT_DESC" 
            ? props.setSortBy("AMT_DESC") 
            : props.setSortBy("AMT_ASC")
          } className="pure-menu-link pure-menu-selected">Amount<span> <i className="fas fa-sort-amount-down"></i></span></div>
        default:
          return <div onClick={() => props.sortBy !== "AMT_ASC" && props.sortBy !== "AMT_DESC" 
            ? props.setSortBy("AMT_DESC") 
            : props.setSortBy("AMT_ASC")
          } className="pure-menu-link">Amount<span> <i className="fas fa-sort-amount-down"></i></span></div>
      }
    }
}

export default SortMenu;
