import React from 'react';
import { Link } from 'react-router-dom';
import { currency } from '../utils/helpers';
import moment from 'moment';

const BalanceCard = ({ amount, facility, city, dueDate }) => (
  <div className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--2">
    <h3 className="card-balance vads-u-margin-top--0">
      <Link to="/balance-details">{currency(amount)}</Link>
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
          <strong className="vads-u-margin-x--0p5">
            {moment(dueDate, 'MM-DD-YYYY').format('MMMM D, YYYY')}
          </strong>
          to avoid late charges, interest, or collection actions.
        </p>
      </div>
    )}
    <Link className="vads-u-font-size--sm" to="/balance-details">
      <strong>
        {amount
          ? 'Check details and resolve this bill'
          : 'Check your balance details'}
      </strong>
      <i
        className="fa fa-chevron-right vads-u-margin-left--1"
        aria-hidden="true"
      />
    </Link>
  </div>
);

export default BalanceCard;
