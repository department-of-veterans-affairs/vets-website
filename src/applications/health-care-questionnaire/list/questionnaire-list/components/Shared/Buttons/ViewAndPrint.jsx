import React from 'react';

export default function ViewAndPrint({
  displayArrow = true,
  onClick = () => {},
}) {
  return (
    <button
      className="usa-button va-button view-and-print-button"
      onClick={onClick}
    >
      View and print questions
      {displayArrow && <i className={`fa fa-chevron-right`} />}
    </button>
  );
}
