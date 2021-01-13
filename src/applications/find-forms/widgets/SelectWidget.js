// Dependencies.
import React, { useEffect, useState } from 'react';

// Relative Imports

const SelectWidget = ({ initialState, options, whatIsCurrentState }) => {
  const initialSortingState = initialState || (options ? options[0] : '');

  const [selectVal, setSelectValue] = useState(initialSortingState);

  function updateSelectState(e) {
    const val = e?.target.value || options[0];
    setSelectValue(val);
  }

  useEffect(
    () => {
      if (whatIsCurrentState) whatIsCurrentState(selectVal);
    },
    [whatIsCurrentState, selectVal],
  );

  return (
    <form>
      <select value={selectVal} onChange={updateSelectState}>
        {options &&
          options.map((text, i) => (
            <option key={i} value={text}>
              {text}
            </option>
          ))}
      </select>
    </form>
  );
};

export default SelectWidget;
