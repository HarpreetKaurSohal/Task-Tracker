import { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom"
import Header from "./components/Header"
import Tasks from "./components/Tasks"
import AddTask from "./components/AddTask"
import Footer from "./components/Footer"
import About from "./components/About"

const AddTaskComponent = ({ showAddTask, onAdd }) => {
  return <>{showAddTask && <AddTask onAdd={onAdd} />}</>
}

const TasksComponent = ({ tasks, onDelete, onToggle }) => {
  return (
    <>
      {tasks.length > 0 ? (
        <Tasks tasks={tasks} onDelete={onDelete} onToggle={onToggle} />
      ) : (
        'No tasks to display.'
      )}
    </>
  )
}

function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  }, [])

  //fetch tasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:8080/tasks')
    const data = await res.json()

    return data
  }

  //fetch task
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:8080/tasks/${id}`)
    const data = await res.json()

    return data
  }

  //Add task
  const addTask = async (task) => {
    const res = await fetch('http://localhost:8080/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await res.json()

    setTasks([...tasks, data])

  }

  //Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:8080/tasks/${id}`, {
      method: 'DELETE'
    })

    setTasks(tasks.filter((task) => task.id !== id))
  }

  //toggle reminder
  const toggleRemider = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updTask = {
      ...taskToToggle,
      reminder: !taskToToggle.reminder
    }

    const res = await fetch(`http://localhost:8080/tasks/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(updTask)
      })

    const data = await res.json()

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task))
  }

  return (
    <Router>
      <div className="container">
        {/* render components like xml tag */}
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <AddTaskComponent showAddTask={showAddTask} onAdd={addTask} />
                <TasksComponent tasks={tasks} onDelete={deleteTask} onToggle={toggleRemider} />
              </>
            }
          />
          <Route path='/about' element={<About />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  )
}

export default App;
