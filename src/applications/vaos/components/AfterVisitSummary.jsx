import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';

import InfoAlert from './InfoAlert';
import { GA_PREFIX, AMBULATORY_PATIENT_SUMMARY } from '../utils/constants';
import { selectFeatureTravelPayViewClaimDetails } from '../redux/selectors';
import Section from './Section';
import { buildPdfObjectUrls, revokeObjectUrls } from '../utils/avs';

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

  const hasError = Boolean(appointment.avsError);

  // Collect ambulatory patient summary PDFs with binary present
  const ambAvs = useMemo(
    () =>
      appointment?.avsPdf?.filter(
        f => f?.noteType === AMBULATORY_PATIENT_SUMMARY && f?.binary,
      ) || [],
    [appointment?.avsPdf],
  );

  // Build object URLs once per ambAvs change
  const objectUrls = useMemo(
    () => (ambAvs.length ? buildPdfObjectUrls(ambAvs) : []),
    [ambAvs],
  );

  // Pair each AVS descriptor with its object URL and filter out failed decodes
  const avsPairs = useMemo(
    () =>
      ambAvs
        .map((f, i) => ({ file: f, url: objectUrls[i] }))
        .filter(p => p.url),
    [ambAvs, objectUrls],
  );

  const hasValidPdfAvs = avsPairs.length > 0;
  const hasAvs = Boolean(appointment.avsPath) || hasValidPdfAvs;
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
  if (hasValidPdfAvs) {
    return (
      <Section heading={heading}>
        <ul
          className="vads-u-margin--0 vads-u-padding--0"
          data-testid="after-visit-summary-pdf-list"
        >
          {avsPairs.map(({ file, url }, index) => {
            const multiple = avsPairs.length > 1;
            const linkText = multiple
              ? `After-visit summary ${index + 1}`
              : 'After-visit summary';
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
                  onClick={handleClick}
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
        onClick={handleClick}
      />
    </Section>
  );
}
AfterVisitSummary.propTypes = {
  data: PropTypes.object,
};
