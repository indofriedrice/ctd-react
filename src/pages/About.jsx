import styled from 'styled-components';

const StyledDiv = styled.div`
  text-align: center;
`;

function About() {
  return (
    <StyledDiv>
      <h1>Hello!</h1>
      <p>My name is Fadel Muzahdi, the author of this website.</p>
      <p>
        This To Do List Application is my semester long project for Code The
        Dream. I have dedicated time to ensure that the website is seamless and
        functional. I hope to continue creating useful website applications just
        like this one.
      </p>
    </StyledDiv>
  );
}

export default About;
