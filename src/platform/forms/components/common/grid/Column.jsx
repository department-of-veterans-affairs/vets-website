// libs
import React from 'react';

/**
 * A column layout component
 * @param {string} classNames strig of classNames to be added to the columns class
 * @param {node} children content that the columns class wraps
 * @param {string} role ARIA role for component if needed
 */
function Column(props) {
  const { children, classNames = '', role, testId } = props;

  return (
    <div className={`${classNames} columns`} role={role} data-testid={testId}>
      {children}
    </div>
  );
}

export default Column;
