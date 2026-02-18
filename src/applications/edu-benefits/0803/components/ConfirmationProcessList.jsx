import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';

export default function ProcessList({ pdfUrl, trackingPrefix }) {
  return (
    <va-process-list uswds>
      <va-process-list-item>
        <div
          itemProp="itemListElement"
          className="confirmation-save-pdf-download-section screen-only"
        >
          <h2 className="vads-u-margin-top--0">Download and save your form</h2>
          <p>
            Make sure that your completed form is saved as a PDF on your device.{' '}
            <span className="vads-u-display--inline-block">
              <va-link
                download
                filetype="PDF"
                href={pdfUrl}
                onClick={() =>
                  recordEvent({
                    event: `${trackingPrefix}confirmation-pdf-download`,
                  })
                }
                text="Download completed VA Form 22-0803"
              />
            </span>
          </p>
        </div>
      </va-process-list-item>
      <va-process-list-item header="Gather relevant attachments">
        <div itemProp="itemListElement">
          <p>
            When you submit this form, you will need to attach the following
            documents:
          </p>
          <ul>
            <li>
              The receipt for the test fees, <strong>and</strong>
            </li>
            <li>A copy of your test results</li>
          </ul>
          <p>Gather those documents now.</p>
        </div>
      </va-process-list-item>
      <va-process-list-item
        header="Upload your form and attachments to QuickSubmit or mail them to your Regional Processing Office"
        class="vads-u-padding-bottom--0"
      >
        <div itemProp="itemListElement">
          <p>
            Visit{' '}
            <va-link
              external
              text="QuickSubmit on AccessVA"
              href="https://www.my.va.gov/EducationFileUploads/s/"
            />{' '}
            and upload your saved VA Form 22-0803 as well as your receipt and
            exam results. This is the fastest way for us to process your form.
          </p>
          <p>
            If you would rather print and mail your form and attachments, the
            addresses for your region are listed on this page.
          </p>
        </div>
      </va-process-list-item>
    </va-process-list>
  );
}

ProcessList.propTypes = {
  pdfUrl: PropTypes.string,
  trackingPrefix: PropTypes.string,
};
