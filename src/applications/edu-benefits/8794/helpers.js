import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { readOnlyCertifyingOfficialIntro } from './pages/readOnlyCertifyingOfficialIntro';

export const getReadOnlyPrimaryOfficialTitle = item => {
  if (!item) return null;

  const first = (item.fullName?.first || '').trim() || 'Certifying';
  const middle = (item.fullName?.middle || '').trim();
  const last = (item.fullName?.last || '').trim() || 'Official';

  return [first, middle, last].filter(Boolean).join(' ');
};

export const readOnlyCertifyingOfficialArrayOptions = {
  arrayPath: 'readOnlyCertifyingOfficials',
  nounSingular: 'certifying official',
  nounPlural: 'certifying officials',
  required: false,
  text: {
    getItemName: item => getReadOnlyPrimaryOfficialTitle(item),
    summaryTitleWithoutItems: 'Add read-only certifying officials',
    summaryTitle: props => {
      return `Review your read-only certifying ${
        props?.formData?.readOnlyCertifyingOfficials?.length > 1
          ? 'officials'
          : 'official'
      }`;
    },
    summaryDescriptionWithoutItems: props => {
      const count = props.formData?.readOnlyCertifyingOfficials?.length ?? 0;
      return count > 0 ? null : readOnlyCertifyingOfficialIntro;
    },
  },
};

export const childContent = (pdfUrl, trackingPrefix, goBack) => (
  <div data-testid="download-link">
    <va-alert close-btn-aria-label="Close notification" status="into" visible>
      <h2 slot="headline">Complete all submission steps</h2>
      <p className="vads-u-margin-y--0">
        This form requires additional steps for successful submission. Follow
        the instructions below carefully to ensure your form is submitted
        correctly.
      </p>
    </va-alert>
    <h2 className="vads-u-font-size--h2 vad-u-margin-top--0">
      To submit your form, follow the steps below
    </h2>
    <va-process-list uswds>
      <va-process-list-item>
        <div
          itemProp="itemListElement"
          className="confirmation-save-pdf-download-section screen-only custom-classname"
        >
          <h2>Download and save your form</h2>
          <p>
            To submit this form, make sure that your completed form is saved as
            a PDF on your device.{' '}
            <p>
              <va-link
                download
                filetype="PDF"
                href={pdfUrl}
                onClick={() =>
                  recordEvent({
                    event: `${trackingPrefix}confirmation-pdf-download`,
                  })
                }
                text="Download VA Form 22-8794"
              />
            </p>
          </p>
        </div>
      </va-process-list-item>
      <va-process-list-item header="Upload your PDF to the Education File Upload Portal or email it to your State Approving Agency (SAA)">
        <div itemProp="itemListElement">
          <p className="vads-u-margin-top--4">
            <strong>If your institution has a facility code:</strong> Visit the{' '}
            <va-link
              external
              text="Education File Upload Portal"
              href="https://www.my.va.gov/EducationFileUploads/s/"
            />
            , and upload your saved VA Form 22-8794.
          </p>
          <p>
            <strong>
              If your institution doesn’t have a VA facility code or if you are
              submitting the form because your institution has changed
              ownership:
            </strong>{' '}
            Email your downloaded PDF to your State Approving Agency (SAA). you
            need help finding their email address,{' '}
            <va-link
              external
              text="search the SAA contact directory"
              href="https://nasaa-vetseducation.com/nasaa-contacts/"
            />
            .
          </p>
        </div>
      </va-process-list-item>
      <va-process-list-item header="Next steps">
        <div itemProp="itemListElement">
          <p>
            We will generally review your submission within 7-10 business days.
          </p>
          <p>
            <strong>
              If you uploaded your form to the Education File Upload Portal:
            </strong>{' '}
            Once we complete the review, we will email all certifying officials
            listed on this form to confirm that your institution’s information
            has been updated, and include a copy of the WEAMS 1998 report. If
            for any reason we cannot accept your form, we will explain the
            reasons why and give you instructions for re-submission.
          </p>
          <p>
            <strong>If you emailed the form to your SAA:</strong> After
            reviewing your form, the SAA will include it in the approval request
            they submit to the VA. They will reach out if they need more
            information. The VA will contact you directly once the approval
            request has been processed.
          </p>
        </div>
      </va-process-list-item>
    </va-process-list>
    <p>
      <va-button
        className="custom-classname"
        secondary
        text="Print this page"
        data-testid="print-page"
        onClick={() => window.print()}
      />
    </p>
    <p>
      <va-link
        onClick={goBack}
        class="screen-only vads-u-margin-top--1 vads-u-font-weight--bold"
        data-testid="back-button"
        text="Back"
        href="#"
      />
    </p>
  </div>
);
