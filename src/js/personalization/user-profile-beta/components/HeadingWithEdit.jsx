import React from 'react';

function HeadingWithEdit({ children, onEditClick }) {
  return (
    <div>
      <h3 style={{ display: 'inline-block' }}>{ children }</h3> <button onClick={onEditClick} className="va-button-link">Edit</button>
    </div>
  );
}

export default HeadingWithEdit;
