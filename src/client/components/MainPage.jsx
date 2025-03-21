import { useNavigate, Link } from 'react-router-dom';
import React, { useState } from 'react';
import MonthCalendar from './MonthCalendar';
import './MainPage.css';

function MainPage() {
    return (
        <section className='main'>
            <nav id='sidebar'>
                <p>Sidebar</p>
            </nav>
            <MonthCalendar />
        </section>
    );
}

export default MainPage;