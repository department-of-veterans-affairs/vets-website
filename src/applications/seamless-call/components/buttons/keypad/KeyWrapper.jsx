import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { keypadButtonPressed } from '../../../actions';

const KeyWrapper = ({ character, children }) => {
  const dispatch = useDispatch();
  const onClick = useCallback(() => dispatch(keypadButtonPressed(character)), [
    dispatch,
    character,
  ]);

  return (
    <svg
      width="78"
      height="78"
      viewBox="0 0 78 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-testid={`key-${character}`}
      onClick={onClick}
      className="hover:cursor-pointer group"
    >
      <rect
        width="78"
        height="78"
        rx="39"
        fill="#E5E5E5"
        className="group-hover:phone-button-active-bg"
      />
      {children}
    </svg>
  );
};

KeyWrapper.propTypes = {
  character: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default KeyWrapper;
