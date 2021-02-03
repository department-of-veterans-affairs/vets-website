import React from 'react';

export default function ViewAndPrint({ onClick = () => {} }) {
  return (
    <button className="va-button" onClick={onClick}>
      View and print questions
    </button>
  );
}
