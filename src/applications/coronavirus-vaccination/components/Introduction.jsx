import React from 'react';
import { Link } from 'react-router';

export default function Introduction() {
  return (
    <>
      <h2>Introduction</h2>
      <div className="va-introtext">
        <p>This is an introduction</p>
        <Link to="/apply">Begin the application</Link>
      </div>
    </>
  );
}
