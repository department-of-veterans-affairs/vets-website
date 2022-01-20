import React from 'react';
import { Link } from 'react-router-dom';
import {
  currency,
  calcDueDate,
  formatDate,
  verifyCurrentBalance,
} from '../utils/helpers';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const CurrentContent = ({ id, date }) => (
  <p>
    Your balance was updated on {formatDate(date)}. Pay your full balance or
    request financial help before
    <strong className="vads-u-margin-x--0p5" data-testid={`due-date-${id}`}>
      {calcDueDate(date, 30)}
    </strong>
    to avoid late charges, interest, or collection actions.
  </p>
);

const PastDueContent = ({ id, date, amount }) => (
  <p>
    Your balance on
    <strong data-testid={`due-date-${id}`} className="vads-u-margin-x--0p5">
      {formatDate(date)}
    </strong>
    was {currency(amount)}. If you haven’t either paid your full balance or
    requested financial help, contact the VA Health Resource Center at
    <span className="vads-u-margin-x--0p5">
      <Telephone contact={'866-400-1238'} />
    </span>
    (TTY: <Telephone contact={CONTACTS[711]} pattern={PATTERNS['3_DIGIT']} />
    ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
  </p>
);

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
        Copay balance for {facility} - {city}
      </p>
      <div className="card-content">
        <i
          aria-hidden="true"
          role="img"
          className="fa fa-exclamation-triangle"
        />
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

export default BalanceCard;
