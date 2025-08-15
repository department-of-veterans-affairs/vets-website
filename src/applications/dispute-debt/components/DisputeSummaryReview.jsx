import React from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/browser';
import { currency } from '../utils';
import { deductionCodes } from '../constants';

const DisputeSummaryReview = ({ data }) => {
  const { selectedDebts = [] } = data;

  if (!selectedDebts.length) {
    // Log to Sentry when user reaches review page without selecting debts
    Sentry.withScope(scope => {
      scope.setLevel('info');
      scope.setExtra('data', data);
      Sentry.captureMessage(
        'Dispute Debt - Veteran reached review page without selecting any debts',
      );
    });

    return (
      <div className="dispute-summary-review">
        <p>No debts selected for dispute.</p>
      </div>
    );
  }

  return (
    <div className="dispute-summary-review">
      <div className="dispute-summary-content">
        {selectedDebts.map((debt, index) => {
          const debtAmount = debt.currentAr || debt.originalAr || 0;
          const debtType =
            debt.label || deductionCodes[debt.deductionCode] || 'VA debt';
          const debtLabel =
            debt.label || `${currency(debtAmount)} for ${debtType}`;

          return (
            <div
              key={debt.selectedDebtId || index}
              className="debt-summary-entry vads-u-margin-bottom--4"
            >
              <h4 className="vads-u-margin-bottom--2 vads-u-font-size--h5">
                {debtLabel}
              </h4>

              <div className="summary-details">
                {debt.disputeReason && (
                  <div className="summary-row vads-u-margin-bottom--2">
                    <dt className="vads-u-font-weight--bold vads-u-margin-bottom--1">
                      Dispute reason
                    </dt>
                    <dd className="vads-u-margin-left--0">
                      {debt.disputeReason}
                    </dd>
                  </div>
                )}

                {debt.supportStatement && (
                  <div className="summary-row vads-u-margin-bottom--2">
                    <dt className="vads-u-font-weight--bold vads-u-margin-bottom--1">
                      Dispute statement
                    </dt>
                    <dd className="vads-u-margin-left--0">
                      {debt.supportStatement}
                    </dd>
                  </div>
                )}
              </div>

              {index < selectedDebts.length - 1 && (
                <hr className="vads-u-margin-y--4" />
              )}
            </div>
          );
        })}
      </div>

      <div className="form-nav-buttons vads-u-margin-top--4">
        <va-button secondary text="Back" className="vads-u-margin-right--2" />
        <va-button text="Submit dispute" type="submit" />
      </div>
    </div>
  );
};

DisputeSummaryReview.propTypes = {
  data: PropTypes.object.isRequired,
};

export default DisputeSummaryReview;
