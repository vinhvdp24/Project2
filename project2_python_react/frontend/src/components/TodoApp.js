import React, { useState, useEffect } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchTodos = () => {
      fetch(`${apiUrl}/api/todos/`)
        .then(response => response.json())
        .then(data => setTodos(data))
        .catch(error => console.error('Error fetching todos:', error));
    };

    fetchTodos();
  }, [apiUrl]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    fetch(`${apiUrl}/api/todos/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTodoTitle, description: newTodoDescription }),
    })
      .then(response => response.json())
      .then(todo => {
        setTodos([...todos, todo]);
        setNewTodoTitle('');
        setNewTodoDescription('');
      })
      .catch(error => console.error('Error adding todo:', error));
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="card-title text-center mb-4">VanDangPhucVinh_DH52201768</h1>
          <h1 className="card-title text-center mb-4">Todo List</h1>

          <form onSubmit={handleAddTodo}>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Todo Title"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                required
              />
              <input
                type="text"
                className="form-control"
                placeholder="Description (optional)"
                value={newTodoDescription}
                onChange={(e) => setNewTodoDescription(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">Add Todo</button>
            </div>
          </form>

          <ul className="list-group mt-4">
            {todos.map(todo => (
              <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{todo.title}</strong>
                  <br />
                  <small className="text-muted">{todo.description}</small>
                </div>
                <span className={`badge ${todo.completed ? 'bg-success' : 'bg-warning'}`}>
                  {todo.completed ? 'Completed' : 'Pending'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

}

export default TodoApp;
