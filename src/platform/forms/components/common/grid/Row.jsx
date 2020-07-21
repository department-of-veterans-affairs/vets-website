// libs
import React from 'react';

function Row(props) {
  const { children, classNames = '', testId } = props;

  return (
    <div className={`row ${classNames}`} data-testid={testId}>
      {children}
    </div>
  );
}

export default Row;
