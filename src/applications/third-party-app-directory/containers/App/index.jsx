// Node modules.
import React from 'react';
import { MetaTags } from 'react-meta-tags';
// Relative imports.
import ThirdPartyAppList from '../ThirdPartyAppList';

export const App = () => (
  <div
    className="third-party-app-directory vads-l-grid-container vads-u-padding-x--1p5 vads-u-padding-bottom--4"
    data-e2e-id="app"
  >
    <MetaTags>
      <meta
        name="description"
        content="A directory of third-party (non-VA) applications or websites that can share certain information from your VA.gov profile."
      />
      <meta
        name="keywords"
        content="app, directory, connect, third-party, applications"
      />
      <meta property="article:published_time" content="2020-11-20" />
      <meta property="article:modified_time" content="2021-02-15" />
    </MetaTags>
    {/* Derive the Page */}
    <ThirdPartyAppList />
  </div>
);

export default App;
