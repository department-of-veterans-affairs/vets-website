import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';

export const DebtsCard = ({ debtsCount, hasError }) => {
  if (!hasError && debtsCount < 1) {
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
      {hasError ? (
        <>
          <h4 className="vads-u-margin-y--0 vads-u-padding-bottom--1">
            Benefit overpayments
          </h4>
          <va-alert status="warning" slim data-testid="debt-card-alert">
            We can’t show your benefit overpayments right now. Refresh this page
            or try again later.
          </va-alert>
        </>
      ) : (
        <h4
          className="vads-u-margin-y--0 vads-u-padding-bottom--1"
          data-testid="debt-total-header"
        >
          {debtsCount} benefit overpayment
          {debtsCount > 1 ? 's' : ''}
        </h4>
      )}
      <p className="vads-u-margin-y--0 vads-u-margin-top--0p5 vads-u-padding-y--1">
        <va-link
          active
          text="Manage overpayment balances"
          href="/manage-va-debt/summary/debt-balances"
          onClick={() =>
            recordEvent({
              event: 'dashboard-navigation',
              'dashboard-action': 'view-link',
              'dashboard-product': 'view-manage-va-debt',
            })
          }
          data-testid="manage-va-debt-link"
        />
      </p>
    </>
  );

  return (
    <div className="vads-u-margin-bottom--2">
      <va-card>
        <div data-testid="debt-card">{content}</div>
      </va-card>
    </div>
  );
};

DebtsCard.propTypes = {
  debtsCount: PropTypes.number,
  hasError: PropTypes.number.isRequired,
};

export default DebtsCard;
