import React from 'react';
import { Link } from 'react-router-dom';

const BalanceCard = () => (
  <div className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--2">
    <p>BALANCE CARD</p>
    <Link className="vads-u-font-size--sm" to="/balance-details">
      <strong>Check details and resolve this bill</strong>
      <i
        className="fa fa-chevron-right vads-u-margin-left--1"
        aria-hidden="true"
      />
    </Link>
  </div>
);

export const Balances = () => (
  <>
    <h2>What you owe to your 3 facilities</h2>
    <BalanceCard />
    <BalanceCard />
    <BalanceCard />
  </>
);

export default Balances;
