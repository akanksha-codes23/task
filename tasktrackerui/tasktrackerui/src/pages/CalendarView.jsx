import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import { getAllTasks } from "../services/taskService";

import "./CalendarView.css";

function CalendarView() {

  const [events,setEvents] = useState([]);

  useEffect(()=>{

    loadTasks();

  },[]);

  const loadTasks = async()=>{

    const res = await getAllTasks(0,1000);

    const tasks = res.content || [];

    const calendarEvents = tasks
      .filter(t => t.dueDate)
      .map(t=>({

        title: `${t.title} (${t.status})`,
        date: t.dueDate,
        color:
          t.priority === "HIGH"
            ? "#ef4444"
            : t.priority === "MEDIUM"
            ? "#facc15"
            : "#22c55e"

      }));

    setEvents(calendarEvents);

  };

  return (

    <div className="calendar-page">

      <h2>📅 Task Calendar</h2>

      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="80vh"
      />

    </div>

  );

}

export default CalendarView;