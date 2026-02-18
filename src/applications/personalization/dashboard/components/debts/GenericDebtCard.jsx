import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import CTALink from '../CTALink';

const GenericDebtCard = () => {
  const cardHeader = 'Overpayments';

  const linkText = 'Manage your VA debt';

  // Linking to existing applications
  const linkDestination = '/manage-va-debt/summary/debt-balances';

  return (
    <va-card data-testid="generic-debt-card">
      <div
        className="vads-u-display--flex vads-u-width--full vads-u-flex-direction--column vads-u-justify-content--space-between vads-u-align-items--flex-start vads-u-padding--1"
        data-testid="debt-card"
      >
        <h3 className="vads-u-margin-top--0" data-testid="debt-total-header">
          {cardHeader}
        </h3>

        <p className="vads-u-margin-bottom--1 vads-u-margin-top--0">
          Review your current VA benefit debt
        </p>

        <CTALink
          text={linkText}
          href={linkDestination}
          showArrow
          className="vads-u-font-weight--bold"
          onClick={() =>
            recordEvent({
              event: 'dashboard-navigation',
              'dashboard-action': 'view-link',
              'dashboard-product': 'view-manage-va-debt',
            })
          }
          testId="manage-va-debt-link"
        />
      </div>
    </va-card>
  );
};

GenericDebtCard.propTypes = {
  amount: PropTypes.number,
  appType: PropTypes.string,
  count: PropTypes.number,
  date: PropTypes.string,
};

export default GenericDebtCard;
