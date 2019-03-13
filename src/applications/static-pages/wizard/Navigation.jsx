import React from 'react';

const Navigation = ({ noBackButton, goForward, goBack, forwardAllowed }) => (
  <div>
    {!noBackButton && (
      <button onClick={goBack}>
        <span className="button-icon">« </span>
        Back
      </button>
    )}
    <button disabled={!forwardAllowed} onClick={goForward}>
      Next
      <span className="button-icon"> »</span>
    </button>
  </div>
);

export default Navigation;
