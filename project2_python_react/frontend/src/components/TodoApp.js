import React, { useState, useEffect } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchTodos = () => {
    fetch(`${apiUrl}/api/todos/`)
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(error => console.error('Error fetching todos:', error));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

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
    <div>
      <h1>Todo List</h1>

      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          placeholder="Todo Title"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={newTodoDescription}
          onChange={(e) => setNewTodoDescription(e.target.value)}
        />
        <button type="submit">Add Todo</button>
      </form>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <strong>{todo.title}</strong>: {todo.description} - {todo.completed ? 'Completed' : 'Pending'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
