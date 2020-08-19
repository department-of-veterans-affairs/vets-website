// libs
import React from 'react';

/**
 * A row layout component
 * @param {string} classNames strig of classNames to be added to the rows class
 * @param {node} children content that the rows class wraps
 * @param {string} role ARIA role for component if needed
 */
function Row(props) {
  const { children, classNames = '', role, testId } = props;

  return (
    <div className={`row ${classNames}`} role={role} data-testid={testId}>
      {children}
    </div>
  );
}

export default Row;
