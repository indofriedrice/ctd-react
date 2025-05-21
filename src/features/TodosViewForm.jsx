import { useState, useEffect } from 'react';
import styled from 'styled-components';

const StyledForm = styled.form`
  padding: 0.5rem 0;
`;

const StyledButton = styled.button`
  margin-left: 0.5rem;
`;

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
`;

function TodosViewForm({
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
}) {
  const [localQueryString, setLocalQueryString] = useState(queryString);

  function preventRefresh(event) {
    event.preventDefault();
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);

    return () => {
      clearTimeout(debounce);
    };
  }, [localQueryString, setQueryString]);

  return (
    <StyledForm onSubmit={preventRefresh}>
      <div>
        <label htmlFor="searchTodo"></label>
        <input
          type="text"
          id="searchTodo"
          placeholder="Search..."
          value={localQueryString}
          onChange={(e) => setLocalQueryString(e.target.value)}
        ></input>
        <StyledButton type="button" onClick={() => setLocalQueryString('')}>
          Clear
        </StyledButton>
      </div>
      <StyledDiv>
        <label htmlFor="sortField">Sort: </label>
        <select
          id="sortField"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </select>

        <label htmlFor="sortDirection"> Direction: </label>
        <select
          id="sortDirection"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </StyledDiv>
    </StyledForm>
  );
}

export default TodosViewForm;
