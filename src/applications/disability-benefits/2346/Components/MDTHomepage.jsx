import React from 'react';
import { Link } from 'react-router';

export const MDTHomePage = () => (
  <div>
    <h1>Home Page</h1>
    <Link to="/confirmaddress">
      <button>Confirm Your Address</button>
    </Link>
    <Link to="/orderTables">
      <button> View Order History </button>
    </Link>
  </div>
);
