function TodoForm() {
  return (
    <form>
      <label htmlFor="todoTitle">To Do: </label>
      <input id="todoTitle"></input>
      <button type="submit">Add To Do</button>
    </form>
  );
}

export default TodoForm;
