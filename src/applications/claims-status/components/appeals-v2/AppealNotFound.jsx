import React from 'react';
import { Link } from 'react-router-dom-v5-compat';

const AppealNotFound = () => (
  <div className="row">
    <h1>Sorry, we couldn’t find that appeal.</h1>
    <Link to="/your-claims">Go back to your claims and appeals</Link>
  </div>
);

export default AppealNotFound;
