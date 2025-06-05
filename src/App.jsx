import { useState, useEffect, useCallback, useReducer } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import './App.css';
import styles from './App.module.css';
import TodosPage from './pages/TodosPage';
import About from './pages/About';
import NotFound from './pages/NotFound';
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodoState,
} from './reducers/todos.reducer';

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodoState);
  const { todoList, isLoading, isSaving, errorMessage } = todoState;

  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');
  const [title, setTitle] = useState('Todo List');

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const encodeUrl = useCallback(() => {
    const sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = '';
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }

    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [queryString, sortField, sortDirection]);

  useEffect(() => {
    const fetchTodos = async () => {
      // reminder in case broken: loading state
      dispatch({ type: todoActions.fetchTodos });

      const options = {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      };

      try {
        const resp = await fetch(encodeUrl(), options);

        if (!resp.ok) {
          throw new Error(resp.message);
        }

        const data = await resp.json();

        // todoList state
        dispatch({
          type: todoActions.loadTodos,
          records: data.records,
        });
      } catch (error) {
        // error state
        dispatch({
          type: todoActions.setLoadError,
          error,
        });
      }
    };

    fetchTodos();
  }, [sortField, sortDirection, queryString]);

  // personal note: the addTodo function is defined in the parent.
  // then, it is passed to the child so that the child can tell the parent to do something. Ex: <TodoForm onAddTodo={addTodo} />
  // when the child gets a new todo, it tells the addTodo in the parent to add it to the state. Ex. callback invocation
  const addTodo = async (newTodo) => {
    dispatch({ type: todoActions.startRequest });

    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: newTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(encodeUrl(), options);

      if (!resp.ok) {
        throw new Error(resp.message);
      }

      const { records } = await resp.json();
      dispatch({
        type: todoActions.addTodo,
        records,
      });
    } catch (error) {
      dispatch({
        type: todoActions.setLoadError,
        error,
      });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  const refactorTodo = async (id, fields, updaterFunction) => {
    const originalTodos = [...todoList];

    // Ensure both have optimistic update
    dispatch({
      type: todoActions.updateTodo,
      editedTodo: {
        id,
        ...fields,
      },
    });

    // This will change according to each function
    const payload = {
      records: [
        {
          id,
          fields,
        },
      ],
    };

    // This options remain constant for both functions
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(encodeUrl(), options);

      if (!resp.ok) {
        throw new Error(resp.statusText);
      }

      const { records } = await resp.json();
      const updatedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };

      if (!updatedTodo.isCompleted) updatedTodo.isCompleted = false;
    } catch (error) {
      dispatch({
        type: todoActions.revertTodo,
        editedTodo: originalTodos,
        error,
      });
    }
  };

  // For personal understanding, these are refactored functions which pass in arguments for the helper function! ex. arg1 (string), arg2 (object), arg3 (functon)
  const updateTodo = async (editedTodo) => {
    refactorTodo(
      editedTodo.id,
      { title: editedTodo.title, isCompleted: editedTodo.isCompleted },
      () =>
        todoList.map((todo) =>
          todo.id === editedTodo.id ? { ...todo, ...editedTodo } : todo
        )
    );
  };

  const completeTodo = async (id) => {
    refactorTodo(id, { isCompleted: true }, () =>
      todoList.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: true } : todo
      )
    );

    dispatch({
      type: todoActions.completeTodo,
      id,
    });
  };

  const handleError = () => {
    dispatch({ type: todoActions.clearError });
  };

  const location = useLocation();
  useEffect(() => {
    if (location.pathname === '/') {
      setTitle('Todo List');
    } else if (location.pathname === '/about') {
      setTitle('About');
    } else {
      setTitle('Not Found');
    }
  }, [location]);

  return (
    <div className={styles.appContainer}>
      <Routes>
        <Route
          path="/"
          element={
            <TodosPage
              title={title}
              todoList={todoList}
              isLoading={isLoading}
              isSaving={isSaving}
              errorMessage={errorMessage}
              onAddTodo={addTodo}
              onCompleteTodo={completeTodo}
              onUpdateTodo={updateTodo}
              sortField={sortField}
              setSortField={setSortField}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              queryString={queryString}
              setQueryString={setQueryString}
              onClearError={handleError}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
