import React from 'react';

export default function ViewAndPrint({ displayArrow = true }) {
  return (
    <button className="usa-button va-button view-and-print-button">
      View and print questions
      {displayArrow && <i className={`fa fa-chevron-right`} />}
    </button>
  );
}
