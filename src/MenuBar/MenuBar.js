import React from 'react';

function MenuBar (props) {
    
    return (
        <div className="management-panel-menu-bar">
            <div onClick={(e) => handleMenuItemClick("Transactions", e)}
                className={props.route === "Transactions" 
                ? 
                "management-panel-menu-item active"
                :
                "management-panel-menu-item"}>
                <div>Transactions</div>
                <i className="far fa-list-alt fa-1x"></i>
            </div>
            <div onClick={(e) => handleMenuItemClick("Reports", e)}
                className={props.route === "Reports" 
                ? 
                "management-panel-menu-item active"
                :
                "management-panel-menu-item"}>
                <div>Reports</div>
                <i className="far fa-chart-bar fa-1x"></i>
            </div>
        </div>
    );

    function handleMenuItemClick(route, event) {
        props.setRoute(route);
    }
};

export default MenuBar;