import React from 'react';
import ReactDOM from 'react-dom';

function runAxeCheck() {
  const axe = require('@axe-core/react');
  axe(React, ReactDOM, 1000);
}

export { runAxeCheck };
