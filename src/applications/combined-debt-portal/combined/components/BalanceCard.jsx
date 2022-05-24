import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { APP_TYPES, currency, formatDate } from '../utils/helpers';

const BalanceCard = ({ amount, count, date, appType }) => {
  const cardHeader =
    appType === APP_TYPES.DEBT
      ? `for ${count} outstanding debt${count > 1 ? 's' : ''}`
      : `for ${count} copay bill${count > 1 ? 's' : ''}`;

  const linkText =
    appType === APP_TYPES.DEBT
      ? 'Check the status and resolve your debt'
      : 'Check your balance and resolve your bill';

  // Linking to existing applications
  // TODO: update a tag with Link component after merge
  const linkDestination =
    appType === APP_TYPES.DEBT ? `/debt-balances` : `/copay-balances`;

  return (
    <div
      className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--2"
      data-testid={`balance-card-${
        appType === APP_TYPES.DEBT ? 'debt' : 'copay'
      }`}
    >
      {/* aria-describedby={`copay-balance-${id}`} */}
      <h3
        className="vads-u-font-size--h3 vads-u-font-family--serif vads-u-margin-top--0"
        data-testid="card-amount"
      >
        {currency(amount)}
      </h3>
      <p
        className="vads-u-font-family--serif vads-u-font-size--h4 vads-u-margin-top--0"
        data-testid="card-header"
      >
        {cardHeader}
      </p>
      {date && (
        <p className="card-date">
          Updated on
          <span className="vads-u-margin-x--0p5">{formatDate(date)}</span>
        </p>
      )}
      <Link
        className="vads-u-font-size--sm vads-u-font-weight--bold"
        to={linkDestination}
        data-testid="card-link"
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
  appType: PropTypes.string,
  count: PropTypes.number,
  date: PropTypes.string,
};

export default BalanceCard;
