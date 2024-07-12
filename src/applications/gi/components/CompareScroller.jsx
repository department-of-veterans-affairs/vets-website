import React from 'react';
import classNames from 'classnames';

export default function({ currentScroll, divisions, divisionWidth, onClick }) {
  const currentPosition = Math.floor((currentScroll + 20) / divisionWidth);
  const circles = [];

  for (let i = 0; i < divisions; i++) {
    circles.push(
      <div
        key={i}
        className={classNames('gi-compare-circle', {
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
          <va-icon
            icon="navigate_before"
            class="arrow-icon"
            size={9}
            onClick={() => arrowClick(-1)}
          />
        </div>
        <div className="vads-u-display--flex circles">{circles}</div>
        <div className="right-arrow scroll-arrrow vads-u-text-align--right">
          <va-icon
            icon="navigate_next"
            class="arrow-icon"
            size={9}
            onClick={() => arrowClick(1)}
          />
        </div>
      </div>
    </div>
  );
}
