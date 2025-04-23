import { useState, useRef } from 'react';

// personal note: TodoForm receives onAddTodo as a prop so we can access it.
function TodoForm({ onAddTodo }) {
  const [workingTodo, setWorkingTodo] = useState('');
  const todoTitleInput = useRef('');

  function handleAddTodo(event) {
    event.preventDefault();

    const newTodo = {
      title: workingTodo,
      id: Date.now(),
      isCompleted: false,
    };

    // this is prop passed from App.jsx (the parent) to the child (TodoForm.jsx).
    // it gets whatever is entered in the <input> into the onAddTodo function and passes it back to the parent.
    // then, the parent re-renders the state with the new update.
    onAddTodo(newTodo);

    setWorkingTodo('');
    todoTitleInput.current.focus();
  }

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">To Do: </label>
      <input
        ref={todoTitleInput}
        name="title"
        id="todoTitle"
        // personal note: not properly cited in the direction but this is how a controlled input syntax looks like.
        // the value holds the current state variable, and onChange is required to update the state variable.
        value={workingTodo}
        onChange={(e) => setWorkingTodo(e.target.value)}
      ></input>
      <button type="submit" disabled={workingTodo === ''}>
        Add To Do
      </button>
    </form>
  );
}

export default TodoForm;
