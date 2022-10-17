import React from 'react';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';
import { FORM_URL } from '../constants';

const DownloadLink = ({
  content = 'Download VA Form 20-0995',
  subTaskEvent = false,
}) => {
  const handler = {
    onClick: () => {
      if (subTaskEvent) {
        recordEvent({
          event: 'howToWizard-alert-link-click',
          'howToWizard-alert-link-click-label': content,
        });
      }
    },
  };

  return (
    <a
      href={FORM_URL}
      download="VBA-20-0995-ARE.pdf"
      type="application/pdf"
      onClick={handler.onClick}
    >
      <i
        aria-hidden="true"
        className="fas fa-download vads-u-padding-right--1"
        role="img"
      />
      {content}{' '}
      <dfn>
        <abbr title="Portable Document Format">PDF</abbr> (1.7
        <abbr title="Megabytes">MB</abbr>)
      </dfn>
    </a>
  );
};

DownloadLink.propTypes = {
  content: PropTypes.string,
  subTaskEvent: PropTypes.bool,
};

export default DownloadLink;
