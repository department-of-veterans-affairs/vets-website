import React from 'react';
import ReactDOM from 'react-dom';

export default function runAxeCheck() {
  const axe = require('@axe-core/react').default;
  axe(React, ReactDOM, 1000);
}
