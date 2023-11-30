import React from 'react';
import PropTypes from 'prop-types';

import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import { missingTotalMessage } from './TotalRatingStates';

export default function CombinedRating({ combinedRating }) {
  if (!combinedRating) {
    return missingTotalMessage();
  }

  const heading = `Your combined disability rating is ${combinedRating}%`;

  return (
    <va-featured-content>
      <h3 slot="headline">{heading}</h3>
      <p>
        This rating doesn’t include any conditions from claims that we’re still
        reviewing. You can check the status of your disability claims, decision
        reviews, or appeals online.
      </p>
      <a
        href="/claim-or-appeal-status/"
        onClick={() => {
          recordEvent({
            event: 'disability-navigation-check-claims',
          });
        }}
      >
        Check the status of your claims, decision reviews, or appeals online
      </a>
    </va-featured-content>
  );
}

CombinedRating.propTypes = {
  combinedRating: PropTypes.number,
};
