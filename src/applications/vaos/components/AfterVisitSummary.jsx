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
import useAmbAvs from './hooks/useAmbAvs';

function handleLegacyAvsClick() {
  recordEvent({
    event: `${GA_PREFIX}-after-visit-summary-link-clicked`,
  });
}

function handleOhAvsPdfClick(pdfCount) {
  recordEvent({
    event: `${GA_PREFIX}-after-visit-summary-pdf-link-clicked`,
  });
  datadogRum.addAction(`${GA_PREFIX}-oh-avs-pdf-link-clicked`, {
    pdfCount,
  });
}

export default function AfterVisitSummary({ data: appointment }) {
  const heading = 'After-visit summary';
  const featureTravelPayViewClaimDetails = useSelector(state =>
    selectFeatureTravelPayViewClaimDetails(state),
  );
  const featureAddOHAvs = useSelector(state => selectFeatureAddOhAvs(state));

  const hasError = Boolean(appointment.avsError);

  // Use hook to derive ambulatory AVS PDFs behind feature flag
  const { avsPairs, hasValidPdfAvs, objectUrls } = useAmbAvs(
    appointment,
    featureAddOHAvs,
  );
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
  if (!hasAvs) {
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
        <ul
          className="vads-u-margin--0 vads-u-padding--0"
          data-testid="after-visit-summary-pdf-list"
        >
          {avsPairs.map(({ file, url }, index) => {
            const multiple = avsPairs.length > 1;
            const linkText = multiple
              ? `Review after-visit summary ${index + 1}`
              : 'Review after-visit summary';
            return (
              <li
                key={file?.id}
                className="vads-u-margin-bottom--1"
                style={{ listStyle: 'none' }}
              >
                <va-link
                  href={url}
                  download
                  text={linkText}
                  data-testid={`after-visit-summary-pdf-${file?.id}`}
                  aria-label={`${linkText} PDF`}
                  onClick={() => handleOhAvsPdfClick(avsPairs.length)}
                />
              </li>
            );
          })}
        </ul>
      </Section>
    );
  }
  return (
    <Section heading={heading}>
      <va-link
        href={`${appointment?.avsPath}`}
        text="Go to after visit summary"
        data-testid="after-vist-summary-link"
        onClick={handleLegacyAvsClick}
      />
    </Section>
  );
}
AfterVisitSummary.propTypes = {
  data: PropTypes.object,
};
