// Node modules.
import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';
// Relative imports.
import SearchPage from '../../components/SearchPage';
import manifest from '../../manifest.json';

export const App = () => (
  <div
    className="third-party-apps vads-l-grid-container vads-u-padding-x--1p5 vads-u-padding-bottom--4"
    data-e2e-id="app"
  >
    {/* Breadcrumbs */}
    <Breadcrumbs className="vads-u-padding-x--0 vads-u-padding-y--1p5 medium-screen:vads-u-padding-y--0">
      <a href="/">Home</a>
      <a href={manifest.rootUrl}>App directory</a>
    </Breadcrumbs>

    {/* Derive the Page */}
    <SearchPage />
  </div>
);

export default App;
