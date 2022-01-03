import React from 'react';
import { Link } from 'react-router-dom';
import { currency, calcDueDate } from '../utils/helpers';

const BalanceCard = ({ id, amount, facility, city, date }) => {
  return (
    <div
      className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--2"
      data-testid={`balance-card-${id}`}
    >
      <h3
        aria-describedby={`copay-balance-${id}`}
        className="card-balance vads-u-margin-top--0"
        data-testid={`amount-${id}`}
      >
        {currency(amount)}
      </h3>
      <p
        id={`copay-balance-${id}`}
        className="card-heading vads-u-margin-top--0"
        data-testid={`facility-city-${id}`}
      >
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
            <strong
              className="vads-u-margin-x--0p5"
              data-testid={`due-date-${id}`}
            >
              {calcDueDate(date, 30)}
            </strong>
            to avoid late charges, interest, or collection actions.
          </p>
        </div>
      )}

      {/* TODO: need to come back to this and do a check for zero balance with and without statements */}
      {/* if no statement no link if has statements put link */}
      {amount ? (
        <Link
          className="vads-u-font-size--sm vads-u-font-weight--bold"
          to={`/balance-details/${id}`}
          data-testid={`detail-link-${id}`}
          aria-label={
            amount
              ? `Check details and resolve bill for ${facility} in ${city}`
              : `Check details for ${facility} in ${city}`
          }
        >
          {amount ? 'Check details and resolve this bill' : 'Check details'}

          <i
            className="fa fa-chevron-right vads-u-margin-left--1"
            aria-hidden="true"
          />
        </Link>
      ) : null}
    </div>
  );
};

export default BalanceCard;
