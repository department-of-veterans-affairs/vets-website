import React from 'react';
import ReactDOM from 'react-dom';

export default function runAxeCheck() {
  const axe = require('@axe-core/react');
  axe(React, ReactDOM, 1000);
}
