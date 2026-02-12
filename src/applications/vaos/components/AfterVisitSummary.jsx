import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import { datadogRum } from '@datadog/browser-rum';

import InfoAlert from './InfoAlert';
import { GA_PREFIX } from '../utils/constants';
import {
  selectFeatureTravelPayViewClaimDetails,
  selectFeatureAddOhAvs,
} from '../redux/selectors';
import Section from './Section';
import { revokeObjectUrls } from '../utils/avs';
import useAmbAvs from './AppointmentCard/hooks/useAmbAvs';
import AvsPdfList from './AvsPdfList';

function handleLegacyAvsClick() {
  recordEvent({
    event: `${GA_PREFIX}-after-visit-summary-link-clicked`,
  });
}

export default function AfterVisitSummary({ data: appointment }) {
  const heading = 'After-visit summary';
  const featureTravelPayViewClaimDetails = useSelector(state =>
    selectFeatureTravelPayViewClaimDetails(state),
  );
  const featureAddOHAvs = useSelector(state => selectFeatureAddOhAvs(state));

  // Use hook to derive ambulatory AVS PDFs behind feature flag
  const {
    avsPairs,
    hasValidPdfAvs,
    hasRetrievalErrors,
    objectUrls,
  } = useAmbAvs(appointment, featureAddOHAvs);

  const hasAvsError = Boolean(appointment.avsError);
  const hasAvs = Boolean(appointment.avsPath) || hasValidPdfAvs;

  // Track when OH AVS PDFs are rendered (fire only once per render)
  const hasTrackedRender = useRef(false);
  useEffect(
    () => {
      if (featureAddOHAvs && hasValidPdfAvs && !hasTrackedRender.current) {
        hasTrackedRender.current = true;
        datadogRum.addAction(`${GA_PREFIX}-oh-avs-pdf-rendered`, {
          pdfCount: avsPairs.length,
        });
      }
    },
    [featureAddOHAvs, hasValidPdfAvs, avsPairs.length],
  );

  useEffect(
    () => () => {
      revokeObjectUrls(objectUrls);
    },
    [objectUrls],
  );

  if (hasAvsError || hasRetrievalErrors) {
    if (featureTravelPayViewClaimDetails && !hasAvs) {
      return null;
    }

    return (
      <Section heading={heading}>
        {!featureTravelPayViewClaimDetails && (
          <InfoAlert
            status="error"
            level={2}
            headline="We can't access after-visit summaries at this time."
          >
            We're sorry. We've run into a problem.
          </InfoAlert>
        )}
        <AvsPdfList
          avsPairs={avsPairs}
          featureTravelPayViewClaimDetails={featureTravelPayViewClaimDetails}
          hasAvsError={hasAvsError}
          hasRetrievalErrors={hasRetrievalErrors}
        />
      </Section>
    );
  }
  if (!hasAvs && !hasValidPdfAvs) {
    return (
      <Section heading={heading}>
        <p className="vads-u-margin--0">
          An after-visit summary is not available at this time.
        </p>
      </Section>
    );
  }
  if (featureAddOHAvs && hasValidPdfAvs) {
    return (
      <Section heading={heading}>
        <AvsPdfList
          avsPairs={avsPairs}
          featureTravelPayViewClaimDetails={featureTravelPayViewClaimDetails}
          hasAvsError={false}
          hasRetrievalErrors={false}
        />
      </Section>
    );
  }
  return (
    <Section heading={heading}>
      <va-link
        href={`${appointment?.avsPath}`}
        text="Go to after visit summary"
        data-testid="after-visit-summary-link"
        onClick={handleLegacyAvsClick}
      />
    </Section>
  );
}
AfterVisitSummary.propTypes = {
  data: PropTypes.object,
};
