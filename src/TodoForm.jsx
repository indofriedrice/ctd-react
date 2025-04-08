import { useRef } from 'react';

// personal note: TodoForm receives onAddTodo as a prop so we can access it.
function TodoForm({ onAddTodo }) {
  const todoTitleInput = useRef('');

  function handleAddTodo(event) {
    event.preventDefault();

    const title = event.target.title.value;
    // this is prop passed from App.jsx (the parent) to the child (TodoForm.jsx).
    // it gets whatever is entered in the <input> into the onAddTodo function and passes it back to the parent.
    // then, the parent re-renders the state with the new update.

    const newTodo = {
      title: title,
      id: Date.now()
    };

    onAddTodo(newTodo);

    event.target.title.value = '';
    todoTitleInput.current.focus();
  }

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">To Do: </label>
      <input ref={todoTitleInput} name="title" id="todoTitle"></input>
      <button type="submit">Add To Do</button>
    </form>
  );
}

export default TodoForm;
