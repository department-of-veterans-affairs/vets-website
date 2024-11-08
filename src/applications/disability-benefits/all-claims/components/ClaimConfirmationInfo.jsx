import PropTypes from 'prop-types';
import React from 'react';
import { capitalizeEachWord, formatDate, formatFullName } from '../utils';
import { NULL_CONDITION_STRING } from '../constants';

export function ClaimConfirmationInfo({
  fullName,
  dateSubmitted,
  conditions,
  claimId,
}) {
  const name = formatFullName(fullName);
  return (
    <va-summary-box>
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
              {conditions.map((disability, i) => (
                <li key={i} className="vads-u-margin-bottom--0">
                  {typeof disability === 'string'
                    ? capitalizeEachWord(disability)
                    : NULL_CONDITION_STRING}
                </li>
              ))}
            </ul>
          </li>
          <li>
            <strong>Claim ID number</strong>
            <div>{claimId}</div>
          </li>
        </ul>
      </div>
    </va-summary-box>
  );
}

ClaimConfirmationInfo.propTypes = {
  claimId: PropTypes.string,
  conditions: PropTypes.array,
  dateSubmitted: PropTypes.string,
  fullName: PropTypes.string,
};
