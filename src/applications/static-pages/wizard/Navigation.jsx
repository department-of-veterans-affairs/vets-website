import React from 'react';

const Navigation = ({ goForward, goBack }) => (
  <div>
    <button onClick={goBack}>Previous</button>
    <button onClick={goForward}>Next</button>
  </div>
);

export default Navigation;
