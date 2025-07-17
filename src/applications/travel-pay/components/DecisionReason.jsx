import React from 'react';
import PropTypes from 'prop-types';

import { STATUSES } from '../constants';

const DecisionReason = ({ claimStatus, decisionLetterReason }) => {
  const formatDecisionReason = text => {
    if (!text) return '';

    const cfrPattern = /Authority (\d+) CFR (\d+)\.(\d+)/;
    const parts = text.split(/(Authority \d+ CFR \d+\.\d+)/g);

    return parts
      .map((part, index) => {
        if (part && cfrPattern.test(part)) {
          const [, title, chapter, section] = part.match(cfrPattern);
          return (
            <va-link
              key={`cfr-${index}`}
              external
              href={`https://www.ecfr.gov/current/title-${title}/chapter-I/section-${chapter}.${section}`}
              text={part}
            />
          );
        }
        return part;
      })
      .filter(Boolean);
  };

  return (
    <>
      <p className="vads-u-font-weight--bold vads-u-margin-bottom--0">
        {claimStatus === STATUSES.Denied.name
          ? 'Why we denied your claim'
          : 'Why we made a partial payment'}{' '}
      </p>
      <p className="vads-u-margin-top--0">
        {formatDecisionReason(decisionLetterReason)}
      </p>
    </>
  );
};

DecisionReason.propTypes = {
  claimStatus: PropTypes.string,
  decisionLetterReason: PropTypes.string,
};

export default DecisionReason;
