import { useState } from "react";
import { createTask } from "../services/taskService";
import "./CreateTask.css";

export default function CreateTask() {

  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: ""
  });

  const handleChange = (e) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!task.title.trim()) {
      alert("Title is required ❗");
      return;
    }

    try {

      await createTask(task);

      alert("Task created successfully ✅");

      setTask({
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM",
        dueDate: ""
      });

    } catch (error) {

      if (error.response) {
        alert(error.response.data.message || "Invalid data ❌");
      } else {
        alert("Server not reachable ❌");
      }

    }

  };

  return (

    <div className="create-page">

      <div className="create-card">

        <h2>Create Task</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="title"
            placeholder="Task title"
            value={task.title}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Task description (max 500 characters)"
            maxLength={500}
            value={task.description}
            onChange={handleChange}
          />

          <input
            type="date"
            name="dueDate"
            value={task.dueDate}
            onChange={handleChange}
          />

          <select
            name="status"
            value={task.status}
            onChange={handleChange}
          >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>

          <select
            name="priority"
            value={task.priority}
            onChange={handleChange}
          >
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>

          <button type="submit">
            Create Task
          </button>

        </form>

      </div>

    </div>

  );
}