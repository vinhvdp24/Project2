import React from 'react';
import './App.css';
import TodoApp from './components/TodoApp'; // Import TodoApp

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* You can keep or remove the logo and link if you want */}
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
        <h1>My Todo Application</h1>
      </header>
      <main>
        <TodoApp /> {/* Render the TodoApp component */}
      </main>
    </div>
  );
}

export default App;
