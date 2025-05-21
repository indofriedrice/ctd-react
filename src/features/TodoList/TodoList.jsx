import TodoListItem from './TodoListItem';
import styles from './TodoList.module.css';

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);

  return (
    <>
      {isLoading ? (
        <p>Todo list loading...</p>
      ) : (
        <div className={styles.listWrapper}>
          <ul className={styles.list}>
            {filteredTodoList.map((todo) => (
              <TodoListItem
                key={todo.id}
                todo={todo}
                onCompleteTodo={onCompleteTodo}
                onUpdateTodo={onUpdateTodo}
              />
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default TodoList;
