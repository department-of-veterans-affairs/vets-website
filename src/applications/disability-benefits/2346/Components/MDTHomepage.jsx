import React from 'react';
import { Link } from 'react-router';

export const MDTHomePage = () => (
  <div>
    <h1>Home Page</h1>
    <Link to="/confirmaddress">
      <button> Go to Confirm Address Page </button>
    </Link>
    <Link to="/orderpage">
      <button> Go to Order Page </button>
    </Link>
  </div>
);
