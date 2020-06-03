// Dependencies
import React from 'react';
// Relative
import startReactApp from '../../startup/react';
import App from './components/App';

// Are you looking for where this is used?
// Search for `<div data-widget-type="side-nav"></div>` to find all the places
// this React widget is used.
export default data => {
  // Derive the root element to place the App.
  const root = document.querySelector(`[data-widget-type="maintenance-banner"]`);

  // Escape early if there is no root element found.
  if (!root) {
    console.log('data widget maintenance banner not found');
    return;
  }

  // Create the App.
  startReactApp(<App />, root);
};
