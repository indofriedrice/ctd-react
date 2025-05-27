import styled from 'styled-components';

const StyledLabel = styled.label`
  margin-right: 0.5rem;
`;

const StyledInput = styled.input`
  padding: 0.3rem 1rem;
`;

function TextInputWithLabel({ elementId, label, onChange, ref, value }) {
  return (
    <>
      <StyledLabel htmlFor={elementId}>{label}</StyledLabel>
      <StyledInput
        type="text"
        id={elementId}
        placeholder="Add To Do Item..."
        ref={ref}
        value={value}
        onChange={onChange}
      />
    </>
  );
}

export default TextInputWithLabel;
