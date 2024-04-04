import React from 'react';
import PropTypes from 'prop-types';

import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import NoCombinedRating from './NoCombinedRating';

const clickHandler = () => {
  recordEvent({
    event: 'disability-navigation-check-claims',
  });
};

export default function CombinedRating({ combinedRating }) {
  // It may be possible to have a combinedRating of 0,
  // so not using !combinedRating here to avoid showing this
  // component if combinedRating is 0
  if (combinedRating === null || typeof combinedRating === 'undefined') {
    return <NoCombinedRating />;
  }

  const heading = `Your combined disability rating is ${combinedRating}%`;

  return (
    <va-summary-box>
      <h3 slot="headline">{heading}</h3>
      <p>
        This rating doesn’t include any conditions from claims that we’re still
        reviewing. You can check the status of your disability claims, decision
        reviews, or appeals online.
      </p>
      <va-link
        href="/claim-or-appeal-status"
        onClick={clickHandler}
        text="Check the status of your claims, decision reviews, or appeals online"
      />
    </va-summary-box>
  );
}

CombinedRating.propTypes = {
  combinedRating: PropTypes.number,
};
