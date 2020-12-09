import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { FORM_URL } from '../constants';

const DownloadLink = ({
  content = 'download and fill out VA Form 20-0996',
  wizardEvent = false,
}) => (
  <a
    href={FORM_URL}
    download="VBA-20-0996-ARE.pdf"
    type="application/pdf"
    onClick={() => {
      if (wizardEvent) {
        recordEvent({
          event: 'howToWizard-alert-link-click',
          'howToWizard-alert-link-click-label': content,
        });
      }
    }}
  >
    <i
      aria-hidden="true"
      className="fas fa-download vads-u-padding-right--1"
      role="img"
    />
    {content}{' '}
    <dfn>
      <abbr title="Portable Document Format">PDF</abbr> (1.5
      <abbr title="Megabytes">MB</abbr>)
    </dfn>
  </a>
);

export default DownloadLink;
