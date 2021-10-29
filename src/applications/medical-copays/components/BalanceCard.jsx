import React from 'react';
import { Link } from 'react-router-dom';
import { currency, calcDueDate } from '../utils/helpers';

const BalanceCard = ({ id, amount, facility, city, date }) => (
  <div className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--2">
    <h3
      aria-describedby="copay-balance"
      className="card-balance vads-u-margin-top--0"
    >
      {currency(amount)}
    </h3>
    <p id="copay-balance" className="card-heading vads-u-margin-top--0">
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
          <strong className="vads-u-margin-x--0p5">
            {calcDueDate(date, 30)}
          </strong>
          to avoid late charges, interest, or collection actions.
        </p>
      </div>
    )}
    <Link className="vads-u-font-size--sm" to={`/balance-details/${id}`}>
      <strong>
        {amount ? 'Check details and resolve this bill' : 'Check details'}
      </strong>
      <i
        className="fa fa-chevron-right vads-u-margin-left--1"
        aria-hidden="true"
      />
    </Link>
  </div>
);

export default BalanceCard;
