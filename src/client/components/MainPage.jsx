import { useNavigate, NavLink } from "react-router-dom";
import React, { useState } from "react";
import Calendar from "./Calendar";
import Sidebar from "./Sidebar";
import Account from "./Account";
import Tasks from "./Tasks";
import "./MainPage.css";

function MainPage({ type }) {
    return (
        <section className="main">
            <Sidebar />
            { type === "calendar" && <Calendar /> }
            { type === "account" && <Account /> }
            { type === "tasks" && <Tasks /> }
        </section>
    );
}

export default MainPage;
