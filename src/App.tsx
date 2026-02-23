import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([...tasks, input.trim()]);
    setInput('');
  };

  const removeTask = (i: number) => {
    setTasks(tasks.filter((_, idx) => idx !== i));
  };

  return (
    <div className="container">
      <header>
        <h1>Tasks</h1>
        <span className="task-count">{tasks.length} pending</span>
      </header>

      <div className="input-row">
        <input
          className="task-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="Add a new task…"
        />
        <button className="add-btn" onClick={addTask}>Add</button>
      </div>

      <ul className="task-list">
        {tasks.length === 0 && (
          <li className="empty">No tasks yet. Add one above.</li>
        )}
        {tasks.map((task, i) => (
          <li key={i} className="task-item">
            <span>{task}</span>
            <button className="remove-btn" onClick={() => removeTask(i)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;