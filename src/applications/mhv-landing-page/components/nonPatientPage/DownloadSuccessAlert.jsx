import React, { useEffect } from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

const DownloadSuccessAlert = props => {
  const { className, documentType, focusId } = props;
  const headline = `${documentType || 'Download'} started`;

  useEffect(
    () => {
      if (focusId) {
        focusElement(`#${focusId}`);
      }
    },
    [focusId],
  );

  return (
    <VaAlert
      id={focusId}
      status="success"
      className={`vads-u-margin-top--4 no-print ${className}`}
      role="alert"
      data-testid="alert-download-started"
    >
      <h2 slot="headline" data-testid="download-success-alert-message">
        {headline}
      </h2>
      <p className="vads-u-margin--0">
        Your file should download automatically. If it doesn’t, try again. If
        you can’t find it, check your browser settings to find where your
        browser saves downloaded files.
      </p>
    </VaAlert>
  );
};

export default DownloadSuccessAlert;

DownloadSuccessAlert.propTypes = {
  className: PropTypes.string,
  documentType: PropTypes.string,
  focusId: PropTypes.string,
};
