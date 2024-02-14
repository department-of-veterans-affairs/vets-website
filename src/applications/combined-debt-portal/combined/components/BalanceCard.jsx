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
    <va-card
      show-shadow
      class="vads-u-padding--3 vads-u-margin-bottom--3"
      data-testid={`balance-card-${
        appType === APP_TYPES.DEBT ? 'debt' : 'copay'
      }`}
    >
      {/* aria-describedby={`copay-balance-${id}`} */}
      <h3
        className="vads-u-margin-top--0 vads-u-margin-bottom--1p5"
        data-testid="card-amount"
      >
        {currency(amount)}
      </h3>
      <h4
        className="vads-u-margin-top--0  vads-u-margin-bottom--1p5 vads-u-font-weight--normal"
        data-testid="card-header"
      >
        {cardHeader}
      </h4>
      {date && (
        <p className="card-date vads-u-margin-top--0  vads-u-margin-bottom--1p5">
          Updated on
          <span className="vads-u-margin-x--0p5">{formatDate(date)}</span>
        </p>
      )}
      <Link
        className="vads-u-font-weight--bold"
        to={linkDestination}
        data-testid="card-link"
      >
        {linkText}
        <i
          className="fas fa-angle-right vads-u-margin-left--1"
          aria-hidden="true"
        />
      </Link>
    </va-card>
  );
};

BalanceCard.propTypes = {
  amount: PropTypes.number,
  appType: PropTypes.string,
  count: PropTypes.number,
  date: PropTypes.string,
};

export default BalanceCard;
