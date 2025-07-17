import React from 'react';
import PropTypes from 'prop-types';

import { STATUSES } from '../constants';

const DecisionReason = ({ claimStatus, decisionLetterReason }) => {
  const formatDecisionReason = text => {
    if (!text) return '';

    const cfrRegex = /Authority (\d+) CFR (\d+)\.(\d+)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    // eslint-disable-next-line no-cond-assign
    while ((match = cfrRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      // Add the hyperlink
      const [fullMatch, title, chapter, section] = match;
      const url = `https://www.ecfr.gov/current/title-${title}/chapter-I/section-${chapter}.${section}`;
      parts.push(
        <va-link
          key={`cfr-${match.index}`}
          external
          href={url}
          text={fullMatch}
        />,
      );

      lastIndex = cfrRegex.lastIndex;
    }

    // Add any remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
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
