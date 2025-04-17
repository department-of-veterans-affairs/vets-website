import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import scrollTo from '@department-of-veterans-affairs/platform-utilities/scrollTo';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';

import ConfirmationPdfMessages from './ConfirmationPdfMessages';

export const chapterHeaderClass = [
  'vads-u-margin-top--2',
  'vads-u-border-bottom--1px',
  'vads-u-padding-bottom--0p5',
  'vads-u-border-color--gray-light',
].join(' ');

export const ConfirmationTitle = ({ pageTitle }) => (
  <div className="print-only">
    <img
      src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
      alt="VA logo"
      width="300"
    />
    <h2 className="vads-u-margin-top--0">{pageTitle}</h2>
  </div>
);

ConfirmationTitle.propTypes = {
  pageTitle: PropTypes.string,
};

export const ConfirmationAlert = ({ alertTitle, children }) => {
  const alertRef = useRef(null);

  useEffect(() => {
    if (alertRef?.current) {
      scrollTo('topScrollElement');
      // delay focus for Safari
      waitForRenderThenFocus('va-alert h2', alertRef.current);
    }
  }, [alertRef]);

  return (
    <div>
      <va-alert status="success" ref={alertRef}>
        <h2 slot="headline">{alertTitle}</h2>
        {children}
      </va-alert>
    </div>
  );
};

ConfirmationAlert.propTypes = {
  alertTitle: PropTypes.string,
  children: PropTypes.element,
};

export const ConfirmationSummary = ({ name, downloadUrl }) => (
  <div className="screen-only">
    {downloadUrl && (
      <va-summary-box uswds class="vads-u-margin-top--2">
        <h3 slot="headline" className="vads-u-margin-top--0">
          {`Save a PDF copy of your ${name} request`}
        </h3>
        <p>
          {`If you’d like to save a PDF copy of your completed ${name} request for your records, you can download it now.`}
        </p>
        <p>
          <ConfirmationPdfMessages
            pdfApi={downloadUrl}
            successLinkText={`Download a copy of your completed ${name} request (PDF)`}
          />
        </p>
        <p>
          <strong>Note:</strong>
          {` This PDF is for your records only. You’ve already submitted your completed ${name} request. We ask that you don’t send us another copy.`}
        </p>
      </va-summary-box>
    )}

    <h3>Print this confirmation page</h3>
    <p>
      {`You can print this page, which includes a summary of the information you submitted in your ${name} request.`}
    </p>
    <va-button onClick={window.print} text="Print this page" />
  </div>
);

ConfirmationSummary.propTypes = {
  downloadUrl: PropTypes.string,
  name: PropTypes.string,
};

export const ConfirmationReturnLink = () => (
  <div className="screen-only vads-u-margin-top--4">
    <a className="vads-c-action-link--green" href="/">
      Go back to VA.gov
    </a>
  </div>
);
