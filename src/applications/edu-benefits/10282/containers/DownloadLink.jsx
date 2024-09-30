import React from 'react';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';

const FORM_URL = 'https://www.vba.va.gov/pubs/forms/VBA-22-10282-ARE.pdf';

const DownloadLink = ({
  content = 'Download VA Form 22-10282',
  subTaskEvent = false,
}) => {
  const handler = {
    onClick: () => {
      if (subTaskEvent) {
        recordEvent({
          event: 'VA-Form-22-10282-pdf-link-click',
          'VA-Form-22-10282-pdf-link-click-label': content,
        });
      }
    },
  };

  return (
    <va-link
      download
      href={FORM_URL}
      filename="VBA-22-10282-ARE.pdf"
      filetype="PDF"
      text={content}
      onClick={handler.onClick}
    />
  );
};

DownloadLink.propTypes = {
  content: PropTypes.string,
  subTaskEvent: PropTypes.bool,
};

export default DownloadLink;
