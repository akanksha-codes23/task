import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

import {
  getWeeklyProgress,
  getMonthlyProgress,
  getAllTasks
} from "../services/taskService";

import "./Progress.css";

const COLORS = {
  HIGH: "#ef4444",
  MEDIUM: "#facc15",
  LOW: "#22c55e",
  DONE: "#22c55e",
  TODO: "#f97316",
  IN_PROGRESS: "#6366f1"
};

function Progress() {

  const [weekly,setWeekly] = useState([]);
  const [monthly,setMonthly] = useState([]);
  const [tasks,setTasks] = useState([]);

  const [view,setView] = useState("weekly");
  const [dark,setDark] = useState(false);

  const [completed,setCompleted] = useState(0);
  const [pending,setPending] = useState(0);
  const [overdue,setOverdue] = useState(0);

  useEffect(()=>{

    getWeeklyProgress().then(res=>setWeekly(res.data));
    getMonthlyProgress().then(res=>setMonthly(res.data));

    loadTasks();

  },[]);

  const loadTasks = async()=>{

    const res = await getAllTasks(0,1000);

    const list = res.content || [];
    setTasks(list);

    const today = new Date();
    today.setHours(0,0,0,0);

    let done = 0;
    let pend = 0;
    let over = 0;

    list.forEach(t=>{

      if(t.status === "DONE") done++;
      else pend++;

      if(t.dueDate){

        const due = new Date(t.dueDate);
        due.setHours(0,0,0,0);

        if(due < today && t.status !== "DONE"){
          over++;
        }

      }

    });

    setCompleted(done);
    setPending(pend);
    setOverdue(over);

  };

  const total = tasks.length;

  const completionPercent =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  /* STATUS CHART DATA */

  const statusData = [
    { name:"DONE", value:completed },
    { name:"PENDING", value:pending }
  ];

  /* PRIORITY CHART DATA */

  const priorityCounts = {
    HIGH:0,
    MEDIUM:0,
    LOW:0
  };

  tasks.forEach(t=>{
    priorityCounts[t.priority] =
      (priorityCounts[t.priority] || 0) + 1;
  });

  const priorityData = Object.keys(priorityCounts).map(p=>({
    priority:p,
    count:priorityCounts[p]
  }));

  const trendData = view === "weekly" ? weekly : monthly;

  return (

    <div className={`progress-page ${dark ? "dark" : ""}`}>

      {/* HEADER */}

      <div className="progress-header">

        <h2>📊 Advanced Task Dashboard</h2>

        <button
        className="theme-btn"
        onClick={()=>setDark(!dark)}
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>

      </div>


      {/* SUMMARY */}

      <div className="summary-grid">

        <SummaryCard title="Total Tasks" value={total}/>
        <SummaryCard title="Completed" value={completed} color="#22c55e"/>
        <SummaryCard title="Pending" value={pending} color="#6366f1"/>
        <SummaryCard title="Overdue" value={overdue} color="#ef4444"/>

      </div>


      {/* PROGRESS BAR */}

      <div className="progress-bar-card">

        <h4>Task Completion</h4>

        <div className="progress-bar">

          <div
          className="progress-fill"
          style={{width:`${completionPercent}%`}}
          />

        </div>

        <p>{completionPercent}% Completed</p>

      </div>


      {/* VIEW TOGGLE */}

      <div className="view-toggle">

        <button
        className={view==="weekly" ? "active" : ""}
        onClick={()=>setView("weekly")}
        >
          Weekly
        </button>

        <button
        className={view==="monthly" ? "active" : ""}
        onClick={()=>setView("monthly")}
        >
          Monthly
        </button>

      </div>


      {/* CHART GRID */}

      <div className="charts-grid">

        {/* STATUS PIE */}

        <div className="chart-card">

          <h4>Status Distribution</h4>

          <ResponsiveContainer width="100%" height={260}>

            <PieChart>

              <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              >

                {statusData.map((s)=>(
                  <Cell
                  key={s.name}
                  fill={COLORS[s.name] || "#6366f1"}
                  />
                ))}

              </Pie>

              <Tooltip/>

            </PieChart>

          </ResponsiveContainer>

        </div>


        {/* PRIORITY BAR */}

        <div className="chart-card">

          <h4>Priority Distribution</h4>

          <ResponsiveContainer width="100%" height={260}>

            <BarChart data={priorityData}>

              <XAxis dataKey="priority"/>
              <YAxis allowDecimals={false}/>
              <Tooltip/>

              <Bar dataKey="count" fill="#6366f1"/>

            </BarChart>

          </ResponsiveContainer>

        </div>


        {/* TREND */}

        <div className="chart-card">

          <h4>{view==="weekly"?"Weekly":"Monthly"} Trend</h4>

          <ResponsiveContainer width="100%" height={260}>

            <LineChart data={trendData}>

              <XAxis dataKey="priority"/>
              <YAxis allowDecimals={false}/>
              <Tooltip/>

              <Line
              type="monotone"
              dataKey="count"
              stroke="#6366f1"
              strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );

}

const SummaryCard = ({title,value,color})=>(

  <div
  className="summary-card"
  style={{borderTopColor:color || "#6366f1"}}
  >

    <p>{title}</p>
    <h3>{value}</h3>

  </div>

);

export default Progress;