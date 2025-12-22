import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import CTALink from '../CTALink';

export const DebtsCard = ({ debtsCount }) => {
  if (debtsCount < 1) {
    return (
      <p
        className="vads-u-margin-bottom--3 vads-u-margin-top--0"
        data-testid="zero-debt-paragraph"
      >
        Your total VA debt balance is $0.
      </p>
    );
  }

  const content = (
    <>
      <h3 className="vads-u-margin-top--0" data-testid="debt-total-header">
        {debtsCount} overpayment debt
        {debtsCount > 1 ? 's' : ''}
      </h3>
      <p className="vads-u-margin-bottom--1 vads-u-margin-top--0">
        Review your current VA benefit debt
      </p>
      <CTALink
        text="Manage your VA debt"
        href="/manage-va-debt/summary/debt-balances"
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
    </>
  );

  return (
    <div className="vads-u-margin-bottom--3">
      <va-card>
        <div
          className="vads-u-display--flex vads-u-width--full vads-u-flex-direction--column vads-u-justify-content--space-between vads-u-align-items--flex-start vads-u-padding--1"
          data-testid="debt-card"
        >
          {content}
        </div>
      </va-card>
    </div>
  );
};

DebtsCard.propTypes = {
  debtsCount: PropTypes.number.isRequired,
};

export default DebtsCard;
