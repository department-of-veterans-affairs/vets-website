import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="usa-grid usa-grid-full">
      <div className="usa-content vads-u-margin-bottom--3">
        <h1>Request a COVID-19 vaccination</h1>
        {children}
      </div>
    </div>
  );
}
