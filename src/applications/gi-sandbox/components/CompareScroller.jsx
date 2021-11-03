import React from 'react';
import classNames from 'classnames';

export default function({ currentScroll, divisions, divisionWidth, onClick }) {
  const currentPosition = Math.floor((currentScroll + 20) / divisionWidth);
  const circles = [];

  for (let i = 0; i < divisions; i++) {
    circles.push(
      <i
        key={i}
        className={classNames(`fa fa-circle`, {
          'scroll-active': currentPosition === i,
        })}
      />,
    );
  }

  const arrowClick = diff => {
    const position = Math.min(
      Math.max(0, currentPosition + diff),
      divisions - 1,
    );

    if (onClick) {
      onClick(divisionWidth * position);
    }
  };

  return (
    <div className="compare-scroller">
      <div className="scroll-controls">
        <div className="left-arrow scroll-arrrow vads-u-text-align--left">
          <i className={`fa fa-chevron-left`} onClick={() => arrowClick(-1)} />
        </div>
        <div className="vads-u-text-align--center circles">{circles}</div>
        <div className="right-arrow scroll-arrrow vads-u-text-align--right">
          <i className={`fa fa-chevron-right`} onClick={() => arrowClick(1)} />
        </div>
      </div>
    </div>
  );
}
