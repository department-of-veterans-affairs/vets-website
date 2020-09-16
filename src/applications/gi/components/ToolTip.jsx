import React from 'react';
import classNames from 'classnames';

export function ToolTip({ id, text, className, children }) {
  const classes = classNames({ tooltip: text }, className);
  return (
    <div id={id} className={classes}>
      <span aria-hidden="true" className="tooltiptext">
        {text}
      </span>
      {children}
    </div>
  );
}
