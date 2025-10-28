import PropTypes from 'prop-types';
import React from 'react';
import { formatFullName } from '../utils';
import { formatDate } from '../utils/dates/formatting';

export function ClaimConfirmationInfo({
  fullName,
  dateSubmitted,
  conditions,
  claimId,
  isSubmittingBDD,
}) {
  const name = formatFullName(fullName);
  return (
    <va-summary-box class={isSubmittingBDD && 'vads-u-margin-top--4'}>
      <h2 className="vads-u-font-size--h3" slot="headline">
        Disability Compensation Claim{' '}
        <span className="vads-u-font-weight--normal">(Form 21-526EZ)</span>
      </h2>
      {name && <p>{`For ${name}`}</p>}
      <div>
        <ul className="claim-list">
          <li>
            <strong>Date submitted</strong>
            <div>{formatDate(dateSubmitted)}</div>
          </li>
          <li>
            <strong>Conditions claimed</strong>
            <ul className="disability-list vads-u-margin-top--0">
              {conditions.length > 0 ? (
                conditions.map((cond, idx) => (
                  <li
                    key={`${idx}-${cond}`}
                    className="vads-u-margin-bottom--0"
                  >
                    {cond}
                  </li>
                ))
              ) : (
                <li className="vads-u-margin-bottom--0">
                  No new conditions claimed
                </li>
              )}
            </ul>
          </li>
          {claimId && (
            <li>
              <strong>Claim ID number</strong>
              <div>{claimId}</div>
            </li>
          )}
        </ul>
      </div>
    </va-summary-box>
  );
}

ClaimConfirmationInfo.propTypes = {
  claimId: PropTypes.number,
  conditions: PropTypes.array,
  dateSubmitted: PropTypes.object,
  fullName: PropTypes.object,
  isSubmittingBDD: PropTypes.bool,
};
