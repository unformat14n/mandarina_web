import { useNavigate, NavLink } from "react-router-dom";
import React, { useEffect, useState } from "react";

const MiniCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const renderToday = () => {
    setCurrentDate(new Date()); // Resets the current date to today's date
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="empty-day"></div>);
    }

    let today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      let classes = "mini-date";
      if (
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
      ) {
        classes += " mini-today";
      }
      days.push(
        <div key={day} className={classes}>
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="mini-calendar">
      <div className="mini-header">
        <h4 className="accented">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h4>
      </div>
      <div className="mini-week">
        <div className="mini-day">S</div>
        <div className="mini-day">M</div>
        <div className="mini-day">T</div>
        <div className="mini-day">W</div>
        <div className="mini-day">T</div>
        <div className="mini-day">F</div>
        <div className="mini-day">S</div>
      </div>
      <div className="mini-contents">{renderDays()}</div>
    </div>
  );
};

function Sidebar() {
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setShowCalendar(window.innerWidth > 1000);
    };

    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return (
    <nav id="sidebar">
      {/* <div className="sidebar-content"> */}
      <NavLink
        to="/account"
        className="sidebar-item"
        activeclassname="active-link"
      >
        <svg 
            className= "icon size-medium"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
        <span className="sidebar-text">Account</span>
      </NavLink>
      <NavLink
        to="/calendar/"
        className="sidebar-item"
        activeclassname="active-link"
      >
        {/* <span class="material-symbols-outlined">
                        calendar_month
                    </span> */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className= "icon size-medium">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
        </svg>
        <span className="sidebar-text">Calendar</span>
      </NavLink>

      <NavLink
        to="/tasks"
        className="sidebar-item"
        activeclassname="active-link"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className= "icon size-medium">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
        <span className="sidebar-text">Tasks</span>
      </NavLink>
      {showCalendar && <MiniCalendar />}
      {/* </div> */}
    </nav>
  );
}

export default Sidebar;
