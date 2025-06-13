import TodoForm from '../features/TodoForm';
import TodoList from '../features/TodoList/TodoList';
import TodosViewForm from '../features/TodosViewForm';
import Headers from '../shared/Headers';

import { useSearchParams, useNavigate } from 'react-router';
import { useEffect } from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

function TodosPage({
  title,
  todoList,
  isLoading,
  isSaving,
  errorMessage,
  onAddTodo,
  onCompleteTodo,
  onUpdateTodo,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
  handleError,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const itemsPerPage = 8;
  const currentPage = parseInt(searchParams.get('page') || '1', 8);
  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;

  const filteredTodoList = todoList
    .filter((todo) =>
      todo.title.toLowerCase().includes(queryString.toLowerCase())
    )
    .filter((todo) => !todo.isCompleted);
  const totalPages = Math.ceil(filteredTodoList.length / itemsPerPage);
  const paginatedTodoList = filteredTodoList.slice(
    indexOfFirstTodo,
    indexOfFirstTodo + itemsPerPage
  );

  useEffect(() => {
    if (totalPages > 0) {
      const invalidPage =
        Number.isNaN(currentPage) ||
        currentPage < 1 ||
        (totalPages > 0 && currentPage > totalPages);

      if (invalidPage) {
        navigate('/');
      }
    }
  }, [currentPage, totalPages, navigate]);

  const handlePreviousPage = () => {
    const previousPage = Math.max(1, currentPage - 1);
    setSearchParams({ page: previousPage.toString() });
  };

  const handleNextPage = () => {
    const nextPage = Math.min(totalPages, currentPage + 1);
    setSearchParams({ page: nextPage.toString() });
  };

  return (
    <div>
      <Headers title={title} />

      <TodoForm onAddTodo={onAddTodo} isSaving={isSaving} />

      <TodoList
        todoList={paginatedTodoList}
        onCompleteTodo={onCompleteTodo}
        onUpdateTodo={onUpdateTodo}
        isLoading={isLoading}
      />

      <StyledDiv>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </StyledDiv>

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
          <p>{errorMessage}</p>
          <button onClick={handleError}>Dismiss Error</button>
        </div>
      )}
    </div>
  );
}

export default TodosPage;
