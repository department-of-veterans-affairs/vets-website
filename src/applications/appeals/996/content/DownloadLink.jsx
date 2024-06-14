import React from 'react';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';
import { FORM_URL } from '../constants';

const DownloadLink = ({
  content = 'Download VA Form 20-0996',
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
    <va-link
      download
      href={FORM_URL}
      filename="VBA-20-0996-ARE.pdf"
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
