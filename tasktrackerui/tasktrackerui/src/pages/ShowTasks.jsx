import { useEffect, useState } from "react";
import { getAllTasks, deleteTask, updateTask } from "../services/taskService";
import "./ShowTasks.css";

export default function ShowTasks() {

  const [tasks,setTasks] = useState([]);
  const [page,setPage] = useState(0);
  const [totalPages,setTotalPages] = useState(0);

  const [openId,setOpenId] = useState(null);
  const [editId,setEditId] = useState(null);
  const [editTask,setEditTask] = useState({});

  useEffect(()=>{
    loadTasks(page);
  },[page]);

  const loadTasks = async(pageNo)=>{
    const res = await getAllTasks(pageNo,6);
    setTasks(res.content || []);
    setTotalPages(res.totalPages || 0);
  };

  const handleDelete = async(id)=>{
    await deleteTask(id);
    loadTasks(page);
  };

  const startEdit = (task)=>{
    setEditId(task.id);
    setEditTask({...task});
  };

  const saveEdit = async()=>{
    await updateTask(editId,editTask);
    setEditId(null);
    loadTasks(page);
  };

  const toggleCard = (id)=>{
    setOpenId(openId === id ? null : id);
    setEditId(null);
  };

  const isOverdue = (dueDate,status)=>{
    if(!dueDate) return false;

    const today = new Date();
    const due = new Date(dueDate);

    today.setHours(0,0,0,0);
    due.setHours(0,0,0,0);

    return due < today && status !== "DONE";
  };

  return (

    <div className="page-container">

      <h2 className="page-heading">Show Tasks</h2>

      {/* GRID CONTAINER */}
      <div className="task-grid">

        {tasks.map((task)=>(

          <div
          key={task.id}
          className={`task-card ${isOverdue(task.dueDate,task.status) ? "overdue-card" : ""}`}
          onClick={()=>toggleCard(task.id)}
          >

            <h3 className="task-title">{task.title}</h3>

            {openId === task.id && (

              <div
              className="task-details"
              onClick={(e)=>e.stopPropagation()}
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

                  <p className="task-desc">{task.description}</p>

                  {task.createdAt && (
                  <p className="created-date">
                  Created : {task.createdAt.split("T")[0]}
                  </p>
                  )}

                  {task.dueDate && (
                    <p className={`due-date ${isOverdue(task.dueDate,task.status) ? "overdue" : ""}`}>
                      Due Date : {task.dueDate}
                    </p>
                  )}

                  <span className="badge">
                    {task.status} | {task.priority}
                  </span>

                  {isOverdue(task.dueDate,task.status) && (
                    <p className="overdue-warning">
                      ⚠ Task Overdue
                    </p>
                  )}

                  <div className="actions">

                    <button
                    onClick={(e)=>{
                      e.stopPropagation();
                      startEdit(task);
                    }}
                    >
                      Edit
                    </button>

                    <button
                    className="danger"
                    onClick={(e)=>{
                      e.stopPropagation();
                      handleDelete(task.id);
                    }}
                    >
                      Delete
                    </button>

                  </div>

                  </>

                )}

              </div>

            )}

          </div>

        ))}

      </div>


      {/* PAGINATION */}

      <div className="pagination">

        <button
        disabled={page === 0}
        onClick={()=>setPage(page-1)}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_,i)=>(

          <button
          key={i}
          className={page === i ? "active" : ""}
          onClick={()=>setPage(i)}
          >
            {i+1}
          </button>

        ))}

        <button
        disabled={page === totalPages-1}
        onClick={()=>setPage(page+1)}
        >
          Next
        </button>

      </div>

    </div>
  );
}