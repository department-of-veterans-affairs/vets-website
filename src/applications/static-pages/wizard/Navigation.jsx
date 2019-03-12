import React from 'react';

const Navigation = ({ goForward, goBack, forwardAllowed }) => (
  <div>
    <button onClick={goBack}>Previous</button>
    <button disabled={!forwardAllowed} onClick={goForward}>
      Next
    </button>
  </div>
);

export default Navigation;
