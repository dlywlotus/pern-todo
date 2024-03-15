import "./App.css";
import { useState, useEffect } from "react";

function Task({ taskData, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [input, setInput] = useState(taskData.description);

  function saveEdit(e) {
    const id = Number(e.target.closest(".task").dataset.id);
    setIsEditing(false);
    onEdit(id, input);
  }

  return (
    <li className='task' data-id={taskData.todo_id}>
      <div className='flex left'>
        <div className='dot'></div>
        {isEditing ? (
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
            className='edit-field'
          ></input>
        ) : (
          <div>{taskData.description}</div>
        )}
      </div>

      <div className='flex'>
        {isEditing ? (
          <button onClick={saveEdit} className='btn'>
            Save
          </button>
        ) : (
          <button
            onClick={() => {
              setIsEditing(true);
            }}
            className='btn'
          >
            edit
          </button>
        )}
        <button onClick={onDelete} className='btn'>
          delete
        </button>
      </div>
    </li>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    let ignore = false;
    async function getTasks() {
      const res = await fetch("http://localhost:5000/tasks");
      if (!ignore) {
        const data = await res.json();
        setTasks(data);
      }
    }
    getTasks();

    return () => {
      ignore = false;
    };
  }, []);

  async function addTask(e) {
    e.preventDefault();
    setInput("");
    const res = await fetch("http://localhost:5000/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description: input.trim() }),
    });
    const newTask = await res.json();
    setTasks([...tasks, newTask]);
    console.log(newTask);
  }

  async function onEdit(id, newValue) {
    const res = await fetch(`http://localhost:5000/task/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description: newValue }),
    });
    const updatedTask = await res.json();
    setTasks(tasks.map(task => (task.todo_id === id ? updatedTask : task)));
  }

  async function onDelete(e) {
    const id = Number(e.target.closest(".task").dataset.id);
    const res = await fetch(`http://localhost:5000/task/${id}`, {
      method: "DELETE",
    });
    const deletedTask = await res.json();
    setTasks(tasks.filter(task => task.todo_id !== deletedTask.todo_id));
  }
  return (
    <section className='app'>
      <h1>ToDoList</h1>
      <form onSubmit={addTask} className='form'>
        <input
          type='text'
          placeholder='Your task'
          value={input}
          onChange={e => setInput(e.target.value)}
        ></input>
        <button>Add task</button>
      </form>
      <ul>
        {tasks.map(t => (
          <Task
            key={t.todo_id}
            taskData={t}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </section>
  );
}

export default App;
