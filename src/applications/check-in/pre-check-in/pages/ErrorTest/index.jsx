import React, { useState } from 'react';
import BackToHome from '../../../components/BackToHome';

const ErrorTest = () => {
  const [value, setValue] = useState({
    item: { thing: { display: 'click to throw render error' } },
  });
  const throwError = () => {
    setValue({});
  };
  return (
    <div className="vads-l-grid-container vads-u-padding-y--5 ">
      <button onClick={throwError}>{value.item.thing.display}</button>
      <BackToHome />
    </div>
  );
};

export default ErrorTest;
