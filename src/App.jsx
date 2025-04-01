import { useState } from 'react';
import './App.css';
import TodoList from './TodoList';
import TodoForm from './TodoForm';

function App() {
  const [newTodo, setNewTodo] = useState(TodoList.todo);

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm />
      <p>newTodo</p>
      <TodoList />
    </div>
  );
}

export default App;
