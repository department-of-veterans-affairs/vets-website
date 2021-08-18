import React from 'react';
import { Link } from 'react-router-dom';

const BalanceCard = () => (
  <div className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--2">
    <h3 className="card-balance vads-u-margin-top--0">
      <a href="#">$300.00</a>
    </h3>
    <p className="card-heading vads-u-margin-top--0">
      Copay balance for James A. Haley Veterans’ Hospital - Tampa
    </p>
    <div className="card-content">
      <i aria-hidden="true" role="img" className="fa fa-exclamation-triangle" />
      <p>
        Pay your full balance or request financial help before
        <strong> July 9, 2021 </strong>
        to avoid late charges, interest, or collection actions.
      </p>
    </div>
    <Link className="vads-u-font-size--sm" to="/balance-details">
      <strong>Check details and resolve this bill</strong>
      <i
        className="fa fa-chevron-right vads-u-margin-left--1"
        aria-hidden="true"
      />
    </Link>
  </div>
);

export default BalanceCard;
