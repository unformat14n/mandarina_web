import { useNavigate, NavLink } from "react-router-dom";
import React, { useState } from "react";
import Calendar from "./Calendar";
import Sidebar from "./Sidebar";
import "./MainPage.css";

function MainPage() {
    return (
        <section className="main">
            <Sidebar />
            <Calendar />
        </section>
    );
}

export default MainPage;
