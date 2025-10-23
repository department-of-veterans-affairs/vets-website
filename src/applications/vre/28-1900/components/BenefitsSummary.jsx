import React from 'react';
import PropTypes from 'prop-types';

const pluralize = (n, one, many) => `${n ?? 0} ${n === 1 ? one : many}`;

const BenefitsSummary = ({ result, entitlementDetails }) => {
  const max = entitlementDetails?.maxCh31Entitlement ?? {};
  const used = entitlementDetails?.entitlementUsed ?? {};
  const remaining = entitlementDetails?.ch31EntitlementRemaining ?? {};

  const sentence = `${(result || '').trim()} to apply for Chapter 31 benefits`;

  return (
    <>
      <h2 className="vads-u-margin-top--0">Your Benefits</h2>
      <p>
        If you apply, you will be scheduled for a comprehensive initial
        evaluation to review the benefits and services best aligned with your
        individual employment or independent needs.
      </p>

      <div className="vads-u-margin-bottom--3">
        <dl className="vads-u-margin--0">
          <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-y--2 vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-align-items--baseline">
            <dt className="vads-u-font-weight--bold vads-u-min-width--18rem">
              Result
            </dt>
            <dd className="vads-u-margin--0">{sentence}</dd>
          </div>

          <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-y--2 vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-align-items--baseline">
            <dt className="vads-u-font-weight--bold vads-u-min-width--18rem">
              Total months of entitlement
            </dt>
            <dd className="vads-u-margin--0">
              {pluralize(max.month, 'month', 'months')},{' '}
              {pluralize(max.days, 'day', 'days')}
            </dd>
          </div>

          <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-y--2 vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-align-items--baseline">
            <dt className="vads-u-font-weight--bold vads-u-min-width--18rem">
              Months of entitlement you have used for education/training
            </dt>
            <dd className="vads-u-margin--0">
              {pluralize(used.month, 'month', 'months')},{' '}
              {pluralize(used.days, 'day', 'days')}
            </dd>
          </div>

          <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-y--2 vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-align-items--baseline">
            <dt className="vads-u-font-weight--bold vads-u-min-width--18rem">
              Potential months of remaining entitlement toward Chapter 31
              program
            </dt>
            <dd className="vads-u-margin--0">
              {pluralize(remaining.month, 'month', 'months')},{' '}
              {pluralize(remaining.days, 'day', 'days')}
            </dd>
          </div>
        </dl>
      </div>
    </>
  );
};

BenefitsSummary.propTypes = {
  result: PropTypes.string,
  entitlementDetails: PropTypes.shape({
    maxCh31Entitlement: PropTypes.shape({
      month: PropTypes.number,
      days: PropTypes.number,
    }),
    entitlementUsed: PropTypes.shape({
      month: PropTypes.number,
      days: PropTypes.number,
    }),
    ch31EntitlementRemaining: PropTypes.shape({
      month: PropTypes.number,
      days: PropTypes.number,
    }),
  }),
};

export default BenefitsSummary;
