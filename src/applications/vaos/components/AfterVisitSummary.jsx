import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import InfoAlert from './InfoAlert';
import { GA_PREFIX } from '../utils/constants';
import { selectFeatureTravelPayViewClaimDetails } from '../redux/selectors';
import Section from './Section';

function handleClick() {
  recordEvent({
    event: `${GA_PREFIX}-after-visit-summary-link-clicked`,
  });
}

export default function AfterVisitSummary({ data: appointment }) {
  const heading = 'After visit summary';
  const featureTravelPayViewClaimDetails = useSelector(state =>
    selectFeatureTravelPayViewClaimDetails(state),
  );
  const avsLink = appointment.avsPath;
  const hasError = avsLink?.includes('Error');

  if (hasError) {
    if (featureTravelPayViewClaimDetails) {
      return null;
    }
    return (
      <Section heading={heading}>
        <InfoAlert
          status="error"
          level={1}
          headline="We can't access after-visit summaries at this time."
        >
          We’re sorry. We’ve run into a problem.
        </InfoAlert>
      </Section>
    );
  }
  if (!appointment?.avsPath) {
    return (
      <Section heading={heading}>
        <p className="vads-u-margin--0">
          An after-visit summary is not available at this time.
        </p>
      </Section>
    );
  }
  return (
    <Section heading={heading}>
      <va-link
        href={`${appointment?.avsPath}`}
        text="Go to after visit summary"
        data-testid="after-vist-summary-link"
        onClick={handleClick}
      />
    </Section>
  );
}
AfterVisitSummary.propTypes = {
  data: PropTypes.object,
};
