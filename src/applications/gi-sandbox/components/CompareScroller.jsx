import React from 'react';
import classNames from 'classnames';

export default function({ currentScroll, divisions, divisionWidth }) {
  const currentPosition = Math.floor((currentScroll + 10) / divisionWidth);
  const circles = [];

  for (let i = 0; i < divisions; i++) {
    circles.push(
      <i
        className={classNames(`fa fa-circle`, {
          'scroll-active': currentPosition === i,
        })}
      />,
    );
  }
  return (
    <div className="compare-scroller">
      <div className="scroll-controls">
        <div className="left-arrow scroll-arrrow vads-u-text-align--left">
          <i className={`fa fa-chevron-left`} />
        </div>
        <div className="vads-u-text-align--center circles">{circles}</div>
        <div className="right-arrow scroll-arrrow vads-u-text-align--right">
          <i className={`fa fa-chevron-right`} />
        </div>
      </div>
    </div>
  );
}
