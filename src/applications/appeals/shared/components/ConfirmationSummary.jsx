import React from 'react';
import PropTypes from 'prop-types';
import ConfirmationPdfMessages from './ConfirmationPdfMessages';

export const chapterHeaderClass = [
  'vads-u-margin-top--2',
  'vads-u-border-bottom--1px',
  'vads-u-padding-bottom--0p5',
  'vads-u-border-color--gray-light',
].join(' ');

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
    <va-link-action
      disable-analytics
      href="/"
      text="Go back to VA.gov"
      type="primary"
    />
  </div>
);
