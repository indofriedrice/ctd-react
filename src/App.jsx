import { useState, useEffect, useCallback } from 'react';
import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');

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
      setIsLoading(true);

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
        const fetchedData = data.records.map((record) => {
          const todo = {
            id: record.id,
            ...record.fields,
          };
          if (!todo.isCompleted) {
            todo.isCompleted = false;
          }
          return todo;
        });
        setTodoList([...fetchedData]);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, [sortField, sortDirection, queryString]);

  // personal note: the addTodo function is defined in the parent.
  // then, it is passed to the child so that the child can tell the parent to do something. Ex: <TodoForm onAddTodo={addTodo} />
  // when the child gets a new todo, it tells the addTodo in the parent to add it to the state. Ex. callback invocation
  const addTodo = async (newTodo) => {
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
      setIsSaving(true);
      const resp = await fetch(encodeUrl(), options);

      if (!resp.ok) {
        throw new Error(resp.message);
      }

      const { records } = await resp.json();
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };

      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }

      setTodoList([...todoList, savedTodo]);
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const refactorTodo = async (id, fields, updaterFunction) => {
    const originalTodos = [...todoList];

    // Ensure both have optimistic update
    setTodoList(updaterFunction);

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

      if (!updatedTodo.isCompleted) {
        updatedTodo.isCompleted = false;
      }

      setTodoList((currentTodoList) =>
        currentTodoList.map((todo) =>
          todo.id === updatedTodo.id ? { ...updatedTodo } : todo
        )
      );
    } catch (error) {
      console.log(error.message);
      setErrorMessage(`${error.message}. Reverting todo...`);
      setTodoList(originalTodos);
    } finally {
      setIsSaving(false);
    }
  };

  // For personal understanding, these are refactored functions which pass in arguments for the helper function! ex. arg1 (string), arg2 (object), arg3 (functon)
  const updateTodo = async (editedTodo) => {
    refactorTodo(
      editedTodo.id,
      { title: editedTodo.title, isCompleted: editedTodo.isCompleted },
      (currentTodoList) =>
        currentTodoList.map((todo) =>
          todo.id === editedTodo.id ? { ...todo, ...editedTodo } : todo
        )
    );
  };

  const completeTodo = async (id) => {
    refactorTodo(id, { isCompleted: true }, (currentTodoList) =>
      currentTodoList.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: true } : todo
      )
    );
  };

  // const updateTodo = async (editedTodo) => {
  //   const originalTodos = [...todoList];

  //   setTodoList(
  //     todoList.map((todo) =>
  //       todo.id === editedTodo.id ? { ...todo, ...editedTodo } : todo
  //     )
  //   );

  //   const payload = {
  //     records: [
  //       {
  //         id: editedTodo.id,
  //         fields: {
  //           title: editedTodo.title,
  //           isCompleted: editedTodo.isCompleted,
  //         },
  //       },
  //     ],
  //   };

  //   const options = {
  //     method: 'PATCH',
  //     headers: {
  //       Authorization: token,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(payload),
  //   };

  //   try {
  //     const resp = await fetch(url, options);

  //     if (!resp.ok) {
  //       throw new Error(resp.message);
  //     }

  //     const { records } = await resp.json();
  //     const updatedTodo = {
  //       id: records[0]['id'],
  //       ...records[0].fields,
  //     };

  //     if (!records[0].fields.isCompleted) {
  //       updatedTodo.isCompleted = false;
  //     }

  //     // Utilize same logic as completeTodo
  //     setTodoList(
  //       todoList.map((todo) =>
  //         todo.id === updatedTodo.id ? { ...updatedTodo } : todo
  //       )
  //     );
  //   } catch (error) {
  //     console.log(error.message);
  //     setErrorMessage(`${error.message}. Reverting todo...`);
  //     // UI reverts to original state if fetch unsuccesful
  //     setTodoList(originalTodos);
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

  // const completeTodo = async (id) => {
  //   const originalTodos = [...todoList];

  //   // Deviating away from the W7 Lesson direction to do optimistic update
  //   setTodoList(
  //     todoList.map((todo) =>
  //       todo.id === id ? { ...todo, isCompleted: true } : todo
  //     )
  //   );

  //   const payload = {
  //     records: [
  //       {
  //         id: id,
  //         fields: {
  //           isCompleted: true,
  //         },
  //       },
  //     ],
  //   };

  //   const options = {
  //     method: 'PATCH',
  //     headers: {
  //       Authorization: token,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(payload),
  //   };

  //   try {
  //     const resp = await fetch(url, options);

  //     if (!resp.ok) {
  //       throw new Error(resp.message);
  //     }

  //     const { records } = await resp.json();
  //     const completedTodo = {
  //       id: records[0]['id'],
  //       ...records[0].fields,
  //     };

  //     // If condition and syncing back from server in case of anomaly inputs
  //     if (!records[0].fields.isCompleted) {
  //       completedTodo.isCompleted = false;
  //     }

  //     setTodoList(
  //       todoList.map((todo) =>
  //         todo.id === completedTodo.id ? { ...completedTodo } : todo
  //       )
  //     );
  //   } catch (error) {
  //     console.log(error.message);
  //     setErrorMessage(`${error.message}. Reverting todo...`);
  //     // UI reverts to original state if fetch unsuccesful
  //     setTodoList(originalTodos);
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

  // personal note: for the part under TodoList instance to display error, we use the && operator to evaluate errorMessage.
  // if the state is true (not empty string) it returns condition 2 -> the <div> element, otherwise if is it false (empty) return condition 1.

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />
      <hr />
      <TodosViewForm
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        queryString={queryString}
        setQueryString={setQueryString}
      />

      {errorMessage && (
        <div>
          <hr />
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage('')}>Dismiss Error</button>
        </div>
      )}
    </div>
  );
}

export default App;
