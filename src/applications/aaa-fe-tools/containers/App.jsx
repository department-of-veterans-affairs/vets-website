import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';

export default function App() {
  return (
    <div className="usa-grid usa-grid-full">
      <Breadcrumbs>
        <a href="/">Home</a>
        <a href="#!">AAA FE Tools</a>
      </Breadcrumbs>
      <div className="usa-width-three-fourths">
        <h1>Welcome to the App!</h1>
      </div>
    </div>
  );
}
