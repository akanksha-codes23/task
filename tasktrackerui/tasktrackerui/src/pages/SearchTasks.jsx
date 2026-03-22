import { useEffect, useState } from "react";
import { deleteTask, updateTask } from "../services/taskService";
import axios from "axios";
import "./SearchTasks.css";

const API_URL = "http://localhost:8080/api/tasks";

export default function SearchTasks() {

  const [tasks, setTasks] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState({});

  /* 🔥 OVERDUE DETECTION */
  const isOverdue = (dueDate, status) => {
    if (!dueDate) return false;

    const today = new Date();
    const due = new Date(dueDate);

    today.setHours(0,0,0,0);
    due.setHours(0,0,0,0);

    return due < today && status !== "DONE";
  };

  // 🔹 LOAD TASKS
  const loadTasks = async (pageNo = 0) => {
    try {

      const res = await axios.get(API_URL, {
        params: {
          search: search || null,
          status: status || null,
          priority: priority || null,
          page: pageNo,
          size: 6
        }
      });

      setTasks(res.data.content);
      setTotalPages(res.data.totalPages);
      setPage(res.data.number);

    } catch (err) {
      console.error(err);
      setTasks([]);
    }
  };

  useEffect(() => {
    loadTasks(0);
  }, [search, status, priority]);

  // DELETE
  const handleDelete = async (id) => {
    await deleteTask(id);
    loadTasks(page);
  };

  // EDIT
  const startEdit = (task) => {
    setEditId(task.id);
    setEditTask({ ...task });
  };

  const saveEdit = async () => {
    await updateTask(editId, editTask);
    setEditId(null);
    loadTasks(page);
  };

  return (

    <div className="page-container">

      <h2 className="page-heading">Search Tasks</h2>

      {/* SEARCH CARD */}

      <div className="search-card">

        <input
          placeholder="Search by title or description"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

        <div className="filters">

          <select value={status} onChange={(e)=>setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>

          <select value={priority} onChange={(e)=>setPriority(e.target.value)}>
            <option value="">All Priority</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>

        </div>

      </div>


      {/* TASK LIST */}

      <div className="task-list">

        {tasks.map((task)=>(
          
          <div
          key={task.id}
          className={`task-card ${isOverdue(task.dueDate,task.status) ? "overdue-card" : ""}`}
          >

            {editId === task.id ? (

              <>

              <input
              value={editTask.title}
              onChange={(e)=>setEditTask({...editTask,title:e.target.value})}
              />

              <textarea
              value={editTask.description}
              onChange={(e)=>setEditTask({...editTask,description:e.target.value})}
              />

              <input
              type="date"
              value={editTask.dueDate || ""}
              onChange={(e)=>setEditTask({...editTask,dueDate:e.target.value})}
              />

              <select
              value={editTask.status}
              onChange={(e)=>setEditTask({...editTask,status:e.target.value})}
              >
                <option>TODO</option>
                <option>IN_PROGRESS</option>
                <option>DONE</option>
              </select>

              <select
              value={editTask.priority}
              onChange={(e)=>setEditTask({...editTask,priority:e.target.value})}
              >
                <option>HIGH</option>
                <option>MEDIUM</option>
                <option>LOW</option>
              </select>

              <div className="actions">

                <button onClick={saveEdit}>
                  Save
                </button>

                <button
                className="danger"
                onClick={()=>setEditId(null)}
                >
                  Cancel
                </button>

              </div>

              </>

            ) : (

              <>

              <h3>{task.title}</h3>

              <p>{task.description}</p>

              {/* CREATED DATE */}

              {task.createdAt && (

              <p className="created-date">
                Created : {task.createdAt.split("T")[0]}
              </p>

              )}

              {/* DUE DATE */}

              {task.dueDate && (

              <p className={`due-date ${isOverdue(task.dueDate,task.status) ? "overdue" : ""}`}>
                Due Date : {task.dueDate}
              </p>

              )}

              <span className="badge">
                {task.status} | {task.priority}
              </span>

              {/* OVERDUE WARNING */}

              {isOverdue(task.dueDate,task.status) && (

              <p className="overdue-warning">
                ⚠ Task Overdue
              </p>

              )}

              <div className="actions">

                <button onClick={()=>startEdit(task)}>
                  Edit
                </button>

                <button
                className="danger"
                onClick={()=>handleDelete(task.id)}
                >
                  Delete
                </button>

              </div>

              </>

            )}

          </div>

        ))}

        {tasks.length === 0 && (

          <p className="no-data">
            No tasks found
          </p>

        )}

      </div>


      {/* PAGINATION */}

      {totalPages > 1 && (

        <div className="pagination">

          <button
          disabled={page === 0}
          onClick={()=>loadTasks(page-1)}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_,i)=>(

            <button
            key={i}
            className={page === i ? "active" : ""}
            onClick={()=>loadTasks(i)}
            >
              {i+1}
            </button>

          ))}

          <button
          disabled={page === totalPages-1}
          onClick={()=>loadTasks(page+1)}
          >
            Next
          </button>

        </div>

      )}

    </div>
  );
}