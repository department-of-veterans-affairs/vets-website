import React from 'react';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';

const DownloadLink = ({
  content = 'Download VA Form 40-10007',
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
      href="https://www.va.gov/vaforms/va/pdf/va40-10007.pdf"
      // download="va40-10007.pdf"
      type="application/pdf"
      onClick={handler.onClick}
    >
      <va-icon
        /// className="fas fa-download vads-u-padding-right--1"
        icon="file_download"
        size={3}
      />
      {content}{' '}
      <dfn>
        (<abbr title="Portable Document Format">PDF</abbr>, 3 pages)
      </dfn>
    </a>
  );
};

DownloadLink.propTypes = {
  content: PropTypes.string,
  subTaskEvent: PropTypes.bool,
};

export default DownloadLink;
