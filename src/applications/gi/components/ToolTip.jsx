import React from 'react';
import classNames from 'classnames';

export function ToolTip({ id, text, className, disabled, children }) {
  const classes = classNames({ tooltip: !disabled && text }, className);
  return (
    <div id={id} className={classes}>
      {text && (
        <span aria-hidden="true" className="tooltip-text">
          {text}
        </span>
      )}
      {children}
    </div>
  );
}
