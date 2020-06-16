// Dependencies
import React from 'react';
// Relative
import startReactApp from '../../startup/react';
import Banners from './components/Banners';
import './styles.scss';

// Are you looking for where this is used?
// Search for `<div data-widget-type="banners"></div>` to find all the places
// this React widget is used.
export default data => {
  // Derive the root element to place the App.
  const root = document.querySelector(`[data-widget-type="banners"]`);

  // Escape early if there is no root element found.
  if (!root) {
    return;
  }

  // Create the App.
  const props = root.dataset;
  startReactApp(<Banners {...props} />, root);
};
