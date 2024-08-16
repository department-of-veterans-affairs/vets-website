import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toggleKeypad } from '../../../actions';
import LabelledButton from '../LabelledButton';

const HideKeypadButton = () => {
  const dispatch = useDispatch();
  const onClick = useCallback(() => dispatch(toggleKeypad()), [dispatch]);

  return (
    <LabelledButton label="Hide">
      <svg
        width="78"
        height="78"
        viewBox="0 0 78 78"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        data-testid="hide-keypad-button"
        onClick={onClick}
        className="hover:cursor-pointer group"
      >
        <path
          d="M25.1162 40.9766C24.2482 40.1835 24.2482 38.8165 25.1162 38.0234L34.9931 29V50L25.1162 40.9766Z"
          fill="#DFE1E2"
          className="group-hover:phone-button-active-bg"
        />
        <path
          d="M34.9932 29H52.5001C53.6046 29 54.5001 29.8954 54.5001 31V48C54.5001 49.1046 53.6046 50 52.5001 50H34.9932V29Z"
          fill="#DFE1E2"
          className="group-hover:phone-button-active-bg"
        />
        <path
          d="M48.2443 36.0024L41.2501 42.9951M48.2466 43L41.2466 36"
          stroke="#1B1B1B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="group-hover:stroke-white"
        />
      </svg>
    </LabelledButton>
  );
};

export default HideKeypadButton;
