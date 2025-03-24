import { useNavigate, NavLink } from "react-router-dom";
import React, { useState } from "react";
import MonthCalendar from "./MonthCalendar";
import Sidebar from "./Sidebar";
import "./MainPage.css";

function MainPage() {
    return (
        <section className="main">
            <Sidebar />
            <MonthCalendar />
        </section>
    );
}

export default MainPage;
