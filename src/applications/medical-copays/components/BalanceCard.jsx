import React from 'react';
import { Link } from 'react-router-dom';
import { currency } from '../utils/helpers';

const renderText = amount => {
  return amount
    ? 'Check details and resolve this bill'
    : 'Check your balance details';
};

const BalanceCard = ({ amount, facility, city, dueDate }) => (
  <div className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--2">
    <h3 className="card-balance vads-u-margin-top--0">
      <a href="#">{currency(amount)}</a>
    </h3>
    <p className="card-heading vads-u-margin-top--0">
      Copay balance for {facility} - {city}
    </p>
    {!!amount && (
      <div className="card-content">
        <i
          aria-hidden="true"
          role="img"
          className="fa fa-exclamation-triangle"
        />
        <p>
          Pay your full balance or request financial help before
          <strong> {dueDate} </strong>
          to avoid late charges, interest, or collection actions.
        </p>
      </div>
    )}
    <Link className="vads-u-font-size--sm" to="/balance-details">
      <strong>{renderText(amount)}</strong>
      <i
        className="fa fa-chevron-right vads-u-margin-left--1"
        aria-hidden="true"
      />
    </Link>
  </div>
);

export default BalanceCard;
