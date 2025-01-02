import React from 'react';
import { Link } from 'react-router-dom-v5-compat';

export default function About() {
  return (
    <div>
      <h1>About</h1>
      <p>This is a demo application to show how to use React Router.</p>
      <Link to="prescriptions">Prescriptions</Link>
    </div>
  );
}
