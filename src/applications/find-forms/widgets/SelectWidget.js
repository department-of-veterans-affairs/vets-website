// Dependencies.
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const SelectWidget = ({ initialState, options, grabCurrentState }) => {
  const initialSortingState = initialState || (options ? options[0] : '');

  const [selectVal, setSelectValue] = useState(initialSortingState);

  function updateSelectState(e) {
    const val = e?.target.value;
    setSelectValue(val);
  }

  useEffect(
    () => {
      if (grabCurrentState) grabCurrentState(selectVal);
    },
    [grabCurrentState, selectVal],
  );

  if (!options || options.length === 0) return null;

  return (
    <form className="vas-select-widget">
      <select value={selectVal} onChange={updateSelectState}>
        {options &&
          options.map((text, i) => (
            <option key={i} value={text} name={text}>
              {text}
            </option>
          ))}
      </select>
    </form>
  );
};

SelectWidget.propTypes = {
  initialState: PropTypes.string,
  options: PropTypes.array,
  grabCurrentState: PropTypes.func,
};

export default SelectWidget;
