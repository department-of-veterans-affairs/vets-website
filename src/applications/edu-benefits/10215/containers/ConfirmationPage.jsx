import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import environment from 'platform/utilities/environment';
import GetFormHelp from '../components/GetFormHelp';

export const ConfirmationPage = ({ router, route }) => {
  const [claimId, setClaimId] = React.useState(null);
  const form = useSelector(state => state?.form);
  const { submission } = form;

  const submitDate = submission.timestamp;
  const confirmationNumber = submission.response?.confirmationNumber;
  const goBack = e => {
    e.preventDefault();
    router.push('/review-and-submit');
  };
  useEffect(
    () => {
      if (submission?.response?.id) {
        localStorage.setItem(
          '10215ClaimId',
          JSON.stringify(submission?.response?.id),
        );
      }
      setClaimId(JSON.parse(localStorage.getItem('10215ClaimId')));
    },
    [submission],
  );

  const childContent = (
    <div>
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
        <va-process-list-item header="Download and save your form">
          <div itemProp="itemListElement">
            <p>
              Make sure that your completed form is saved as a PDF on your
              device.
            </p>
            <p>
              <va-link
                href={`${
                  environment.API_URL
                }/v0/education_benefits_claims/download_pdf/${claimId}`}
                text="Download VA Form 22-10215"
                download
              />
            </p>
          </div>
        </va-process-list-item>
        <va-process-list-item header="Upload the form to the VA education portal">
          <div itemProp="itemListElement">
            <p>
              Visit the&nbsp;
              <va-link
                external
                text="VA Education File Upload Portal"
                href="https://www.my.va.gov/EducationFileUploads/s/"
              />
              , and upload your saved VA Form 22-10215.
            </p>
          </div>
        </va-process-list-item>
        <va-process-list-item header="Submit your form">
          <div itemProp="itemListElement">
            <p>Once uploaded, click submit to finalize your request.</p>
          </div>
        </va-process-list-item>
      </va-process-list>
      <p>
        <va-button
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
      <h2 className="vads-u-font-size--h2 vad-u-margin-top--0">
        What are my next steps?
      </h2>
      <p>
        After you submit your 85/15 Rule enrollment ratios, we will review them
        within 7-10 business days. Once we review your submission, we will email
        you with our determinations, and any next steps.
      </p>
    </div>
  );

  return (
    <ConfirmationView
      formConfig={route?.formConfig}
      confirmationNumber={confirmationNumber}
      submitDate={submitDate}
      pdfUrl={submission?.response?.pdfUrl}
    >
      {childContent}
      <ConfirmationView.NeedHelp content={<GetFormHelp />} />
    </ConfirmationView>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      fullName: {
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      },
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      timestamp: PropTypes.string,
    }),
  }),
  name: PropTypes.string,
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default ConfirmationPage;
