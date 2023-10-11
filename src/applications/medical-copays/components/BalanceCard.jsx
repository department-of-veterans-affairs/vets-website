import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import {
  currency,
  calcDueDate,
  formatDate,
  verifyCurrentBalance,
} from '../utils/helpers';

const CurrentContent = ({ id, date }) => (
  <p>
    Your balance was updated on {formatDate(date)}. Pay your full balance or
    request financial help before
    <strong className="vads-u-margin-left--0p5" data-testid={`due-date-${id}`}>
      {calcDueDate(date, 30)}
    </strong>
    , to avoid late charges, interest, or collection actions.
  </p>
);

CurrentContent.propTypes = {
  date: PropTypes.string,
  id: PropTypes.string,
};

const PastDueContent = ({ id, date, amount }) => (
  <p>
    Your balance on
    <strong data-testid={`due-date-${id}`} className="vads-u-margin-x--0p5">
      {formatDate(date)}
    </strong>
    was {currency(amount)}. If you haven’t either paid your full balance or
    requested financial help, contact the VA Health Resource Center at
    <span className="vads-u-margin-x--0p5">
      <va-telephone contact="8664001238" />
    </span>
    ( <va-telephone tty contact={CONTACTS[711]} />
    ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
  </p>
);

PastDueContent.propTypes = {
  amount: PropTypes.number,
  date: PropTypes.string,
  id: PropTypes.string,
};

const BalanceCard = ({ id, amount, facility, city, date }) => {
  const isCurrentBalance = verifyCurrentBalance(date);
  const linkText = isCurrentBalance
    ? `Check details and resolve this bill`
    : `Check details`;

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
        {facility} - {city}
      </p>
      <div className="card-content">
        <i
          aria-hidden="true"
          role="img"
          className="fa fa-exclamation-triangle"
        />
        <span className="sr-only">Alert</span>
        {isCurrentBalance ? (
          <CurrentContent id={id} date={date} />
        ) : (
          <PastDueContent id={id} date={date} amount={amount} />
        )}
      </div>
      <Link
        className="vads-u-font-size--sm vads-u-font-weight--bold"
        to={`/balance-details/${id}`}
        data-testid={`detail-link-${id}`}
        aria-label={linkText}
      >
        {linkText}
        <i
          className="fa fa-chevron-right vads-u-margin-left--1"
          aria-hidden="true"
        />
      </Link>
    </div>
  );
};

BalanceCard.propTypes = {
  amount: PropTypes.number,
  city: PropTypes.string,
  date: PropTypes.string,
  facility: PropTypes.string,
  id: PropTypes.string,
};

export default BalanceCard;
