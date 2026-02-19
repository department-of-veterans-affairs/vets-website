import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import environment from '~/platform/utilities/environment';
import { setSubmission } from 'platform/forms-system/src/js/actions';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import recordEvent from 'platform/monitoring/record-event';

import RegionalAccordion from '../components/RegionalAccordion';

const CLAIM_ID = '10272ClaimId';

export const setClaimIdInLocalStage = submission => {
  if (submission?.response?.id) {
    localStorage.setItem(CLAIM_ID, JSON.stringify(submission?.response?.id));
  }
};

export const getClaimIdFromLocalStage = () => {
  return JSON.parse(localStorage.getItem(CLAIM_ID));
};

const ConfirmationSubmissionAlert = () => (
  <p className="vads-u-margin-bottom--0">
    This form requires additional steps for successful submission. Follow the
    instructions below carefully to ensure your form is submitted correctly.
  </p>
);

const ConfirmationWhatsNextProcessList = ({ claimId, trackingPrefix }) => {
  const pdfUrl = `${
    environment.API_URL
  }/v0/education_benefits_claims/download_pdf/${claimId}`;

  const onClick = () => {
    recordEvent({
      event: `${trackingPrefix}confirmation-pdf-download`,
    });
  };

  return (
    <>
      <h2>To submit your form, follow the steps below</h2>
      <va-process-list>
        <va-process-list-item header="Download and save your form">
          <p>
            Make sure your completed form is saved as a PDF on your device.
            {claimId && (
              <span className="vads-u-display--inline-block">
                <va-link
                  download
                  filetype="PDF"
                  href={pdfUrl}
                  onClick={onClick}
                  text="Download your completed VA Form 22-10272"
                />
              </span>
            )}
          </p>
        </va-process-list-item>
        <va-process-list-item header="Gather relevant attachments">
          <p>
            When you submit this form, you will need to attach the following
            documents:
          </p>
          <ul>
            <li>
              The receipt for the cost of the prep course including any fees{' '}
              <strong>and</strong>
            </li>
            <li>Proof of enrollment</li>
          </ul>
          <p>Gather those documents now.</p>
        </va-process-list-item>
        <va-process-list-item header="Upload your form and attachments to QuickSubmit or mail them to your Regional Processing Office">
          <p>
            Visit{' '}
            <va-link
              external
              text="QuickSubmit"
              href="https://eauth.va.gov/accessva/?cspSelectFor=quicksubmit"
            />
            , and upload your saved VA Form 22-10272 as well as your receipt and
            test results. This is the fastest way for us to process your form.
          </p>
          <p>
            If you would rather print and mail your form and attachments, the
            addresses for your region are listed on this page.
          </p>
        </va-process-list-item>
      </va-process-list>
    </>
  );
};

ConfirmationWhatsNextProcessList.propTypes = {
  claimId: PropTypes.string,
  trackingPrefix: PropTypes.string,
};

const ConfirmationPrintThisPage = () => {
  const onPrintPageClick = () => {
    window.print();
  };

  return (
    <va-button
      class="vads-u-margin-bottom--3"
      secondary
      onClick={onPrintPageClick}
      text="Print this page"
    />
  );
};

const ConfirmationGoBackLink = ({ goBack }) => (
  <>
    <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
      <va-link
        onClick={goBack}
        class="screen-only vads-u-margin-top--1 vads-u-font-weight--bold"
        data-testid="back-button"
        text="Back"
        href="#"
      />
    </p>
  </>
);

ConfirmationGoBackLink.propTypes = {
  goBack: PropTypes.func,
};

const ConfirmationMailingAddresses = () => (
  <>
    <h2>Regional Processing Office mailing addresses</h2>
    <RegionalAccordion />
  </>
);

const ConfirmationNextSteps = () => (
  <>
    <h2>What are my next steps?</h2>
    <p className="vads-u-margin-bottom--4">
      After you successfully submit your form, we will review your documents.
      You should hear back within 30 days about your reimbursement.
    </p>
  </>
);

const ConfirmationEligibilityAlert = ({ visible }) => (
  <div className="vads-u-margin-bottom--4">
    <va-alert status="warning" visible={visible}>
      <h2 slot="headline">Additional form needed</h2>
      <p>
        You’ll need to apply and be found eligible for the VA education benefit
        under which you want your reimbursement processed.
      </p>
      <p>
        <va-link
          external
          text="Apply for VA education benefits using Form 22-1990"
          href="https://www.va.gov/education/apply-for-gi-bill-form-22-1990/introduction"
        />
        , <strong>or</strong>
      </p>
      <p>
        <va-link
          external
          text="Apply for VA education benefits as a dependent using Form 22-5490"
          href="https://www.va.gov/family-and-caregiver-benefits/education-and-careers/apply-for-dea-fry-form-22-5490/introduction"
        />
        , <strong>or</strong>
      </p>
      <p>
        <va-link
          external
          text="Apply to use transferred education benefits using Form 22-1990e"
          href="https://www.va.gov/family-and-caregiver-benefits/education-and-careers/transferred-gi-bill-benefits/apply-form-22-1990e/introduction"
        />
      </p>
    </va-alert>
  </div>
);

ConfirmationEligibilityAlert.propTypes = {
  visible: PropTypes.bool,
};

export const ConfirmationPage = props => {
  const [claimId, setClaimId] = React.useState(null);
  const form = useSelector(state => state.form || {});
  const submission = form?.submission;
  const submitDate = submission?.timestamp || '';
  const confirmationNumber =
    submission?.response?.attributes?.confirmationNumber || '';

  const { route, router } = props;
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

  useEffect(
    () => {
      setClaimIdInLocalStage(submission);
      setClaimId(getClaimIdFromLocalStage());
    },
    [submission],
  );

  return (
    <ConfirmationView
      formConfig={route?.formConfig}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      devOnly={{
        showButtons: true,
      }}
    >
      <ConfirmationView.SubmissionAlert
        status="info"
        title="Complete all submission steps"
        content={<ConfirmationSubmissionAlert />}
        actions={null}
      />
      <ConfirmationWhatsNextProcessList
        claimId={claimId}
        trackingPrefix={route?.formConfig?.trackingPrefix}
      />
      <ConfirmationEligibilityAlert visible={!form.data.hasPreviouslyApplied} />
      <ConfirmationPrintThisPage />
      <ConfirmationGoBackLink goBack={goBack} />
      <ConfirmationMailingAddresses />
      <ConfirmationNextSteps />
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
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default ConfirmationPage;
