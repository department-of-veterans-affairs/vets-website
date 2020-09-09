// Node modules.
import React from 'react';
// Relative imports.
import SearchPage from '../../components/SearchPage';

export const App = () => (
  <div
    className="third-party-app-directory vads-l-grid-container vads-u-padding-x--1p5 vads-u-padding-bottom--4"
    data-e2e-id="app"
  >
    {/* Derive the Page */}
    <SearchPage />
  </div>
);

export default App;
