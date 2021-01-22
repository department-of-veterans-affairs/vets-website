// Node modules.
import React from 'react';
// Relative imports.
import ThirdPartyAppList from '../ThirdPartyAppList';

export const App = () => (
  <div
    className="third-party-app-directory vads-l-grid-container vads-u-padding-x--1p5 vads-u-padding-bottom--4"
    data-e2e-id="app"
  >
    {/* Derive the Page */}
    <ThirdPartyAppList />
  </div>
);

export default App;
