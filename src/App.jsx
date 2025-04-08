import { useState } from 'react';
import './App.css';
import TodoList from './TodoList';
import TodoForm from './TodoForm';

function App() {
  const [todoList, setTodoList] = useState([]);
  // personal note: the handleAddTodo function is defined in the parent.
  // then, it is passed to the child so that the child can tell the parent to do something. Ex: <TodoForm onAddTodo={handleAddTodo} />
  // when the child gets a new todo, it tells the handleAddTodo in the parent to add it to the state. Ex. callback invocation
  function handleAddTodo(newTodo) {
    setTodoList([...todoList, newTodo]);
  }

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={handleAddTodo} />
      <TodoList todoList={todoList} />
    </div>
  );
}

export default App;
