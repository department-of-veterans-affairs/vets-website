import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import { datadogRum } from '@datadog/browser-rum';
import { GA_PREFIX } from '../utils/constants';

function handleOhAvsPdfClick(pdfCount) {
  recordEvent({
    event: `${GA_PREFIX}-after-visit-summary-pdf-link-clicked`,
  });
  datadogRum.addAction(`${GA_PREFIX}-oh-avs-pdf-link-clicked`, {
    pdfCount,
  });
}

export default function AvsPdfList({
  avsPairs,
  hasAvsError,
  hasRetrievalErrors,
  featureTravelPayViewClaimDetails,
}) {
  if (!avsPairs || avsPairs.length === 0 || hasAvsError) return null;

  const marginClass =
    hasRetrievalErrors && !featureTravelPayViewClaimDetails
      ? 'vads-u-margin-top--2'
      : '';

  return (
    <ul
      className={`vads-u-margin--0 vads-u-padding--0 ${marginClass}`.trim()}
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
  );
}

AvsPdfList.propTypes = {
  avsPairs: PropTypes.arrayOf(
    PropTypes.shape({
      file: PropTypes.object,
      url: PropTypes.string,
    }),
  ),
  featureTravelPayViewClaimDetails: PropTypes.bool,
  hasAvsError: PropTypes.bool,
  hasRetrievalErrors: PropTypes.bool,
};
