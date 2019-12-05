import React from 'react';
import classnames from 'classnames';

export default function CardRow({ children: cards }) {
  const columnClassName = classnames(
    'vads-l-col--12',
    'vads-u-margin-bottom--1',
    'vads-u-margin-right--1',
    'medium-screen:vads-l-col',
  );

  return (
    <div className="vads-l-grid-container vads-u-padding--0">
      <div className="vads-l-row">
        {cards.map((card, index) => (
          <div key={index} className={columnClassName}>
            {card}
          </div>
        ))}
      </div>
    </div>
  );
}
