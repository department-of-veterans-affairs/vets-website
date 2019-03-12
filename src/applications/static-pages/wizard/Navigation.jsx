import React from 'react';

const Navigation = ({ noBackButton, goForward, goBack, forwardAllowed }) => (
  <div>
    {!noBackButton && <button onClick={goBack}>Previous</button>}
    <button disabled={!forwardAllowed} onClick={goForward}>
      Next
    </button>
  </div>
);

export default Navigation;
