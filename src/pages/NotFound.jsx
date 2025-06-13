import { Link } from 'react-router';
import styled from 'styled-components';

const StyledDiv = styled.div`
  text-align: center;
`;

function NotFound() {
  return (
    <StyledDiv>
      <h1>NOT FOUND</h1>
      <p>Page Not Found.</p>
      <Link to="/">Back to Home</Link>
    </StyledDiv>
  );
}

export default NotFound;
