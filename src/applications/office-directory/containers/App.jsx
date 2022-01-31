import React from 'react';

export default function App({ children }) {
  return (
    <div className="vads-l-grid-container vads-u-padding-x--1p5 vads-u-padding-bottom--4">
      <h1 className="vads-u-margin-bottom--0">All VA offices</h1>
      {children}
    </div>
  );
}
