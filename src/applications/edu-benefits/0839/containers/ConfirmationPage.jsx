import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import environment from '~/platform/utilities/environment';
import { scrollAndFocus } from 'platform/utilities/scroll';
import { setSubmission } from 'platform/forms-system/src/js/actions';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';

const confirmationChildContent = (pdfUrl, goBack) => (
  <div data-testid="download-link">
    <va-alert close-btn-aria-label="Close notification" status="info" visible>
      <h2 slot="headline">Complete all submission steps</h2>
      <p className="vads-u-margin-y--0">
        This form requires additional steps for successful submission. Follow
        the instructions below carefully to ensure your form is submitted
        correctly.
      </p>
    </va-alert>
    <h2 className="vads-u-font-size--h2 vads-u-margin-top--4">
      To submit your form, follow the steps below
    </h2>
    <va-process-list uswds>
      <va-process-list-item header="Download and save your form">
        <div
          itemProp="itemListElement"
          className="confirmation-save-pdf-download-section screen-only custom-classname"
        >
          <p className="vads-u-margin-top--0">
            Make sure that your completed form is saved as a PDF on your device.{' '}
            <span className="vads-u-display--inline-block">
              <va-link
                download
                filetype="PDF"
                href={pdfUrl}
                text="Download completed VA Form 22-0839"
              />
            </span>
          </p>
        </div>
      </va-process-list-item>
      <va-process-list-item header="Upload the form to the Education File Upload Portal">
        <div itemProp="itemListElement">
          <p className="vads-u-margin-top--0">
            Visit the&nbsp;
            <va-link
              external
              text="Education File Upload Portal"
              href="https://www.my.va.gov/EducationFileUploads/s/"
            />
            , and upload your saved VA Form 22-0839.
          </p>
        </div>
      </va-process-list-item>
      <va-process-list-item header="Submit your form">
        <div itemProp="itemListElement">
          <p className="vads-u-margin-top--0">
            Once uploaded, click submit to finalize your request.
          </p>
        </div>
      </va-process-list-item>
    </va-process-list>
    <h2 className="vads-u-font-size--h2 vads-u-margin-top--4 ">
      What are my next steps?
    </h2>
    <p className="vads-u-margin-bottom--4">
      We’ll review your request, which can take up to 30 days. If we have any
      further questions for you, we’ll contact you.
    </p>
    <va-button
      className="custom-classname"
      secondary
      text="Print this page"
      data-testid="print-page"
      onClick={() => window.print()}
    />
    <p className="vads-u-margin-top--4">
      <va-link
        onClick={goBack}
        class="screen-only vads-u-font-weight--bold"
        data-testid="back-button"
        text="Back"
        href="#"
      />
    </p>
  </div>
);

export const ConfirmationPage = ({ router, route }) => {
  const form = useSelector(state => state?.form);
  const { submission } = form;
  const submitDate = new Date(submission?.timestamp);

  const dispatch = useDispatch();

  const resetSubmissionStatus = () => {
    const now = new Date().getTime();

    dispatch(setSubmission('status', false));
    dispatch(setSubmission('timestamp', now));
  };

  const goBack = e => {
    e.preventDefault();
    resetSubmissionStatus();
    if (router?.push) {
      router.push('/review-and-submit');
    } else {
      window.history.back();
    }
  };

  useEffect(() => {
    const alert = document.querySelector('va-alert');
    scrollAndFocus(alert);
  }, []);

  return (
    <ConfirmationView
      formConfig={route?.formConfig}
      confirmationNumber={submission?.response?.confirmationNumber}
      submitDate={submitDate}
    >
      {confirmationChildContent(
        `${environment.API_URL}/v0/education_benefits_claims/download_pdf/${
          submission?.response?.id
        }`,
        goBack,
      )}
    </ConfirmationView>
  );
};

ConfirmationPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default ConfirmationPage;
