import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const FloatingButtonStyled = styled.button`
  position: fixed;
  right: -2.5rem;
  bottom: 1rem;
  cursor: pointer;
  padding: 0.75rem 0.1rem;
  height: 2.4rem;
  margin: 0;
  z-index: 301;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: right 0.3s, padding 0.3s;
  &:hover {
    right: 0;
    padding: 0.75rem 0.75rem 0.75rem 0.2rem;
  }
`;

export const FloatingButton = ({ showVADX, setShowVADX }) => {
  useEffect(() => {
    const handleKeyPress = event => {
      // Check for Ctrl/Cmd + Shift + /
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === '\\'
      ) {
        event.preventDefault();
        setShowVADX(!showVADX);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showVADX, setShowVADX]);

  return (
    <FloatingButtonStyled onClick={() => setShowVADX(!showVADX)} type="button">
      <va-icon icon={showVADX ? 'chevron_right' : 'chevron_left'} size={3} />
      vadx
    </FloatingButtonStyled>
  );
};

FloatingButton.propTypes = {
  setShowVADX: PropTypes.func.isRequired,
  showVADX: PropTypes.bool.isRequired,
};
