import React from 'react';
import PropTypes from 'prop-types';

const BenefitsSummary = ({ result, entitlementDetails }) => {
  const max = entitlementDetails?.maxCh31Entitlement || {};
  const used = entitlementDetails?.entitlementUsed || {};
  const remaining = entitlementDetails?.ch31EntitlementRemaining || {};

  return (
    <>
      <h2 className="vads-u-margin-top--0">Your Benefits</h2>
      <div className="vads-u-margin-bottom--3">
        <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-y--2 vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-align-items--baseline">
          <span
            className="vads-u-font-weight--bold"
            style={{ minWidth: '18rem' }}
          >
            Result
          </span>
          <span>{result || '—'}</span>
        </div>

        <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-y--2 vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-align-items--baseline">
          <span
            className="vads-u-font-weight--bold"
            style={{ minWidth: '18rem' }}
          >
            Total months you received:
          </span>
          <span>
            {max.month ?? 0} months, {max.days ?? 0} days
          </span>
        </div>

        <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-y--2 vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-align-items--baseline">
          <span
            className="vads-u-font-weight--bold"
            style={{ minWidth: '18rem' }}
          >
            Months you used:
          </span>
          <span>
            {used.month ?? 0} months, {used.days ?? 0} days
          </span>
        </div>

        <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-y--2 vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-align-items--baseline">
          <span
            className="vads-u-font-weight--bold"
            style={{ minWidth: '18rem' }}
          >
            Months you have left to use:
          </span>
          <span>
            {remaining.month ?? 0} months, {remaining.days ?? 0} days
          </span>
        </div>
      </div>
    </>
  );
};

BenefitsSummary.propTypes = {
  result: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  entitlementDetails: PropTypes.shape({
    maxCh31Entitlement: PropTypes.shape({
      month: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      days: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
    entitlementUsed: PropTypes.shape({
      month: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      days: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
    ch31EntitlementRemaining: PropTypes.shape({
      month: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      days: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  }),
};

export default BenefitsSummary;
