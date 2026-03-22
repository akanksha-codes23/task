import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {

  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (

    <nav className="navbar">

      <div className="logo">TaskTracker</div>

      <div className={`nav-links ${open ? "active" : ""}`}>

        <Link className={location.pathname === "/" ? "active" : ""} to="/" onClick={()=>setOpen(false)}>Home</Link>

        <Link className={location.pathname === "/create" ? "active" : ""} to="/create" onClick={()=>setOpen(false)}>Create</Link>

        <Link className={location.pathname === "/tasks" ? "active" : ""} to="/tasks" onClick={()=>setOpen(false)}>Show</Link>

        <Link className={location.pathname === "/search" ? "active" : ""} to="/search" onClick={()=>setOpen(false)}>Search</Link>

        <Link className={location.pathname === "/progress" ? "active" : ""} to="/progress" onClick={()=>setOpen(false)}>Progress</Link>

        <Link className={location.pathname === "/calendar" ? "active" : ""} to="/calendar" onClick={()=>setOpen(false)}>Calendar</Link>

      </div>

      <div
        className={`hamburger ${open ? "open" : ""}`}
        onClick={()=>setOpen(!open)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

    </nav>

  );
}