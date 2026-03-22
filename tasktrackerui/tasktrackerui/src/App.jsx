import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import CreateTask from "./pages/CreateTask";
import ShowTasks from "./pages/ShowTasks";
import SearchTasks from "./pages/SearchTasks";
import Progress from "./pages/Progress";
import CalendarView from "./pages/CalendarView";

import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      {/* ✅ Navbar ALWAYS visible */}
      <Navbar />

      {/* ✅ Page content */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateTask />} />
        <Route path="/tasks" element={<ShowTasks />} />
        <Route path="/search" element={<SearchTasks />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/calendar" element={<CalendarView/>}/>
      </Routes>
    </ThemeProvider>
  );
}

export default App;