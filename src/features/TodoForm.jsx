import { useState, useRef } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';

// personal note: TodoForm receives onAddTodo as a prop so we can access it.
function TodoForm({ onAddTodo, isSaving }) {
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
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        ref={todoTitleInput}
        value={workingTodo}
        onChange={(e) => setWorkingTodo(e.target.value)}
      ></TextInputWithLabel>
      <button type="submit" disabled={workingTodo === ''}>
        {isSaving ? 'Saving...' : 'Add Todo'}
      </button>
    </form>
  );
}

export default TodoForm;
