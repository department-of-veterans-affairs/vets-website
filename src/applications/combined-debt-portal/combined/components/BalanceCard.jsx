import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { APP_TYPES, currency, formatDate } from '../utils/helpers';

const BalanceCard = ({ amount, count, date, appType }) => {
  const cardHeader =
    appType === APP_TYPES.DEBT
      ? `for ${count} benefit overpayment${count > 1 ? 's' : ''}`
      : `for ${count} copay bill${count > 1 ? 's' : ''}`;

  const linkText =
    appType === APP_TYPES.DEBT
      ? 'Review details and resolve overpayments'
      : 'Review details and resolve copay bills';

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
      <h2
        className="vads-u-margin-top--0 vads-u-margin-bottom--1p5 vads-u-font-size--h3"
        data-testid="card-amount"
      >
        {currency(amount)} {cardHeader}
      </h2>
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
        <va-icon icon="navigate_next" size={2} class="cdp-link-icon--active" />
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
