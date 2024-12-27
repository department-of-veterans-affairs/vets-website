import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import recordEvent from '~/platform/monitoring/record-event';
import {
  currency,
  calcDueDate,
  formatDate,
  verifyCurrentBalance,
} from '../../combined/utils/helpers';

const CurrentContent = ({ id, date }) => (
  <p className="vads-u-margin--0">
    Your balance was updated on {formatDate(date)}. Pay your balance now or
    request help by{' '}
    <strong data-testid={`due-date-${id}`}>{calcDueDate(date, 30)}</strong>.
  </p>
);

CurrentContent.propTypes = {
  date: PropTypes.string,
  id: PropTypes.string,
};

const PastDueContent = ({ id, date, amount }) => (
  <p className="vads-u-margin--0">
    Your balance on{' '}
    <strong data-testid={`due-date-${id}`}>{formatDate(date)}</strong> was{' '}
    {currency(amount)}. If you haven’t paid your balance in full or requested
    financial help, contact the VA Health Resource Center at{' '}
    <va-telephone contact="8664001238" /> (
    <va-telephone tty contact={CONTACTS[711]} />
    ).
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
    <va-card
      show-shadow
      class="vads-u-padding--3 vads-u-margin-bottom--3"
      data-testid={`balance-card-${id}`}
    >
      <h3
        data-testid={`facility-city-${id}`}
        className="vads-u-margin-top--0 vads-u-margin-bottom--1p5"
      >
        {facility} - {city}
      </h3>
      <p
        className="vads-u-margin-top--0 vads-u-margin-bottom--1p5 vads-u-font-size--h4 vads-u-font-family--serif"
        data-testid={`amount-${id}`}
      >
        <span className="vads-u-font-weight--normal">Current balance: </span>
        <strong>{currency(amount)}</strong>
      </p>
      <div className="vads-u-display--flex vads-u-margin-top--0  vads-u-margin-bottom--1p5">
        <va-icon
          icon="warning"
          size={3}
          srtext="Important"
          class="icon-color--warning vads-u-padding-right--1"
        />

        {isCurrentBalance ? (
          <CurrentContent id={id} date={date} />
        ) : (
          <PastDueContent id={id} date={date} amount={amount} />
        )}
      </div>
      <Link
        className="vads-u-font-weight--bold"
        to={`/copay-balances/${id}/detail`}
        data-testid={`detail-link-${id}`}
        aria-label={`Check details and resolve this debt for ${facility}`}
        onClick={() => {
          recordEvent({ event: 'cta-link-click-copay-balance-card' });
        }}
      >
        {linkText}
        <va-icon icon="navigate_next" size={2} class="cdp-link-icon--active" />
      </Link>
    </va-card>
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
