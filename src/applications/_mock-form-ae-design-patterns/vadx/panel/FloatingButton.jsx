import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const FloatingButtonStyled = styled.button`
  position: fixed;
  left: -2.5rem;
  bottom: 1rem;
  cursor: pointer;
  padding: 0.75rem 0.1rem;
  height: 2.4rem;
  margin: 0;
  z-index: 301;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: left 0.3s, padding 0.3s;
  &:hover {
    left: 0;
    padding: 0.75rem 0.2rem 0.75rem 0.75rem;
  }
`;

export const FloatingButton = ({ showVADX, setShowVADX }) => {
  return (
    <FloatingButtonStyled onClick={() => setShowVADX(!showVADX)} type="button">
      vadx
      <va-icon icon={showVADX ? 'chevron_left' : 'chevron_right'} size={3} />
    </FloatingButtonStyled>
  );
};

FloatingButton.propTypes = {
  setShowVADX: PropTypes.func.isRequired,
  showVADX: PropTypes.bool.isRequired,
};
