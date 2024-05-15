import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import InfoAlert from './InfoAlert';
import { GA_PREFIX } from '../utils/constants';

function handleClick() {
  recordEvent({
    event: `${GA_PREFIX}-after-visit-summary-link-clicked`,
  });
}

export default function AfterVisitSummary({ data: appointment }) {
  const avsLink = appointment.avsPath;
  const hasError = avsLink?.includes('Error');

  if (hasError) {
    return (
      <InfoAlert
        status="error"
        level={1}
        headline="We can't access after-visit summaries at this time."
      >
        We’re sorry. We’ve run into a problem.
      </InfoAlert>
    );
  }
  if (!avsLink) {
    return (
      <p className="vads-u-margin--0">
        An after-visit summary is not available at this time.
      </p>
    );
  }
  return (
    <va-link
      href={`${appointment?.avsPath}`}
      text="Go to after visit summary"
      data-testid="after-vist-summary-link"
      onClick={handleClick}
    />
  );
}
AfterVisitSummary.propTypes = {
  data: PropTypes.object,
};
