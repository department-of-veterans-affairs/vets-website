import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toggleKeypad } from '../../actions';
import LabelledButton from './LabelledButton';

const ShowKeypadButton = () => {
  const dispatch = useDispatch();
  const onClick = useCallback(() => dispatch(toggleKeypad()), [dispatch]);

  return (
    <LabelledButton label="Keypad">
      <svg
        width="78"
        height="78"
        viewBox="0 0 78 78"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        data-testid="show-keypad-button"
        onClick={onClick}
        className="hover:cursor-pointer group"
      >
        <circle
          cx="39"
          cy="39"
          r="38.5"
          stroke="#636366"
          className="group-hover:phone-button-active-bg"
        />
        <circle
          cx="27.0287"
          cy="27.0287"
          r="5.02867"
          fill="#636366"
          className="group-hover:text-white"
        />
        <circle
          cx="27.0287"
          cy="39.0974"
          r="5.02867"
          fill="#636366"
          className="group-hover:text-white"
        />
        <circle
          cx="27.0287"
          cy="51.1662"
          r="5.02867"
          fill="#636366"
          className="group-hover:text-white"
        />
        <circle
          cx="51.9715"
          cy="27.0287"
          r="5.02867"
          fill="#636366"
          className="group-hover:text-white"
        />
        <circle
          cx="51.9715"
          cy="39.0974"
          r="5.02867"
          fill="#636366"
          className="group-hover:text-white"
        />
        <circle
          cx="51.9715"
          cy="51.1662"
          r="5.02867"
          fill="#636366"
          className="group-hover:text-white"
        />
        <circle
          cx="39.5004"
          cy="27.0287"
          r="5.02867"
          fill="#636366"
          className="group-hover:text-white"
        />
        <circle
          cx="39.5004"
          cy="39.0974"
          r="5.02867"
          fill="#636366"
          className="group-hover:text-white"
        />
        <circle
          cx="39.5004"
          cy="51.1662"
          r="5.02867"
          fill="#636366"
          className="group-hover:text-white"
        />
      </svg>
    </LabelledButton>
  );
};

export default ShowKeypadButton;
