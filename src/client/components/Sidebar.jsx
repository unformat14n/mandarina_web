import { useNavigate, NavLink } from "react-router-dom";
import React, { useState } from "react";

function Sidebar() {
    return (
        <nav id="sidebar">
            <NavLink
                to="/account"
                className="sidebar-item"
                activeClassName="active">
                Account
            </NavLink>
            <NavLink
                to="/calendar/monthly"
                className="sidebar-item"
                activeClassName="active">
                {/* <span class="material-symbols-outlined">
                        calendar_month
                    </span> */}
                Calendar
            </NavLink>
            <NavLink
                to="/tasks"
                className="sidebar-item"
                activeClassName="active">
                Tasks
            </NavLink>
            <NavLink
                to="/theme"
                className="sidebar-item"
                activeClassName="active">
                Theme
            </NavLink>
            <NavLink
                to="/settings"
                className="sidebar-item"
                activeClassName="active">
                Settings
            </NavLink>
        </nav>
    );
}

export default Sidebar;
