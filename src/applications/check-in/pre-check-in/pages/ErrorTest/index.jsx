import React, { useState, useCallback } from 'react';

const ErrorTest = () => {
  const [value, setValue] = useState({
    item: { thing: { display: 'click to throw render error' } },
  });
  const throwError = useCallback(
    () => {
      setValue({});
    },
    [setValue],
  );
  return (
    <div className="vads-l-grid-container vads-u-padding-y--5 ">
      <va-button text={value.item.thing.display} onClick={throwError} />
    </div>
  );
};

export default ErrorTest;
