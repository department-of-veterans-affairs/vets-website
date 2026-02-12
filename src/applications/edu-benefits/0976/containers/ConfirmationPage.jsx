import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { scrollAndFocus } from 'platform/utilities/scroll';
import { setSubmission } from 'platform/forms-system/src/js/actions';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import environment from '~/platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';

const ProcessList = () => (
  <va-process-list uswds>
    <va-process-list-item header="Download a PDF of your completed form">
      <div itemProp="itemListElement">
        <p>
          Be sure to download and save the PDF to your device.{' '}
          <strong>Please note:</strong> this online tool does not submit the
          form for you. You must download your completed form as a PDF and
          proceed to the next step.
        </p>
      </div>
    </va-process-list-item>
    <va-process-list-item header="Email your completed form to Federal.Approvals@va.gov">
      <div itemProp="itemListElement">
        <p>
          We will need to confirm the information regarding your institution and
          your program is correct.
        </p>
        <p>
          If your institution doesn’t have a VA facility code or if you are
          submitting the form because your institution has changed ownership:
          Email your completed PDF to{' '}
          <a href="mailto:Federal.Approvals@va.gov" rel="noreferrer">
            Federal.Approvals@va.gov
          </a>
          .
        </p>
      </div>
    </va-process-list-item>
    <va-process-list-item
      header="We'll keep you updated"
      class="vads-u-padding-bottom--0"
    >
      <div itemProp="itemListElement">
        <p>
          You’ll get an email verifying the information you’ve been asked to
          provide regarding your institution’s financial soundness and program
          details. From here, you will receive additional contact regarding your
          application.
        </p>
      </div>
    </va-process-list-item>
  </va-process-list>
);

const PdfDownload = ({ pdfUrl, trackingPrefix }) => {
  const onClick = () => {
    recordEvent({
      event: `${trackingPrefix}confirmation-pdf-download`,
    });
  };

  return (
    <div>
      <h2 id="download-header">
        You’ll need to download a copy of your completed form
      </h2>
      <p>
        Download the completed PDF copy of your form and send it to{' '}
        <a href="mailto:Federal.Approvals@va.gov" rel="noreferrer">
          Federal.Approvals@va.gov
        </a>
      </p>
      <p>
        <va-link
          data-testid="download-link"
          download
          filetype="PDF"
          href={pdfUrl}
          onClick={onClick}
          text="Download a copy of your VA Form 22-0976"
        />
      </p>
    </div>
  );
};

export const ConfirmationPage = ({ router, route }) => {
  const form = useSelector(state => state.form || {});
  const submission = form?.submission || {};
  const submitDate = submission?.timestamp || '';
  const dispatch = useDispatch();

  const resetSubmissionStatus = () => {
    const now = new Date().getTime();

    dispatch(setSubmission('status', false));
    dispatch(setSubmission('timestamp', now));
  };

  useEffect(() => {
    const h2 = document.querySelector('#download-header');
    scrollAndFocus(h2);
  }, []);

  const goBack = e => {
    e.preventDefault();
    resetSubmissionStatus();
    if (router?.push) {
      router.push('/review-and-submit');
    } else {
      window.history.back();
    }
  };

  return (
    <ConfirmationView
      formConfig={route?.formConfig}
      submitDate={submitDate}
      devOnly={{
        showButtons: true,
      }}
    >
      <PdfDownload
        trackingPrefix={route?.formConfig.trackingPrefix}
        pdfUrl={`${
          environment.API_URL
        }/v0/education_benefits_claims/download_pdf/${submission.response?.id}`}
      />
      <ConfirmationView.ChapterSectionCollection />
      <ConfirmationView.PrintThisPage />
      <h2>What to expect next</h2>
      <ProcessList />
      <p>
        <va-link
          onClick={goBack}
          class="screen-only vads-u-margin-top--1 vads-u-font-weight--bold"
          data-testid="back-button"
          text="Back"
          href="#"
        />
      </p>
    </ConfirmationView>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.object,
    formId: PropTypes.string,
    submission: PropTypes.shape({
      timestamp: PropTypes.string,
    }),
  }),
  name: PropTypes.string,
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
};

export default ConfirmationPage;
