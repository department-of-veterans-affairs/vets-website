import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import { setSubmission } from 'platform/forms-system/src/js/actions';
import { scrollAndFocus } from 'platform/utilities/scroll';
import environment from '~/platform/utilities/environment';
import RegionalAccordion from '../components/RegionalAccordion';
import ConfirmationProcessList from '../components/ConfirmationProcessList';

const CLAIM_ID = '0803ClaimId';

export const setClaimIdInLocalStage = submission => {
  if (submission?.response?.id) {
    localStorage.setItem(CLAIM_ID, JSON.stringify(submission?.response?.id));
  }
};

export const getClaimIdFromLocalStage = () => {
  return JSON.parse(localStorage.getItem(CLAIM_ID));
};

function AlertBox() {
  return (
    <va-alert close-btn-aria-label="Close notification" status="into" visible>
      <h2 slot="headline">Complete all submission steps</h2>
      <p className="vads-u-margin-y--0">
        This form requires additional steps for successful submission. Follow
        the instructions below carefully to ensure your form is submitted
        correctly.
      </p>
    </va-alert>
  );
}

export const ConfirmationPage = props => {
  const [claimId, setClaimId] = useState(null);
  const form = useSelector(state => state.form || {});
  const submission = form?.submission || {};
  const submitDate = submission?.timestamp || '';
  const confirmationNumber = submission?.response?.confirmationNumber || '';
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

  useEffect(() => {
    // make sure we scroll to and focus on the
    // alert notifying the user that additional
    // steps are required
    const firsth2 = document.querySelector('va-alert > h2');
    scrollAndFocus(firsth2);
  }, []);

  return (
    <ConfirmationView
      formConfig={props.route?.formConfig}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      devOnly={{
        showButtons: true,
      }}
    >
      <div data-testid="download-link">
        <AlertBox />
        <h2 className="vads-u-font-size--h2 vad-u-margin-top--0">
          To submit your form, follow the steps below
        </h2>
        <ConfirmationProcessList
          pdfUrl={`${
            environment.API_URL
          }/v0/education_benefits_claims/download_pdf/${claimId}`}
          trackingPrefix={route?.formConfig?.trackingPrefix}
        />
        <va-alert status="warning" visible={!form.data.hasPreviouslyApplied}>
          <h2 slot="headline">Additional form needed</h2>
          <p>
            You’ll need to apply and be found eligible for the VA education
            benefit under which you want your reimbursement processed.
          </p>
          <p>
            <va-link
              external
              href="https://www.va.gov/education/apply-for-gi-bill-form-22-1990/introduction"
              text="Application for VA Education Benefits Form 22-1990"
            />
            , <strong>or</strong>
          </p>
          <p>
            <va-link
              external
              href="https://www.va.gov/family-and-caregiver-benefits/education-and-careers/apply-for-dea-fry-form-22-5490/introduction"
              text="Apply for VA education benefits as a dependent using Form 22-5490"
            />
            , <strong>or</strong>
          </p>
          <p>
            <va-link
              external
              href="https://www.va.gov/family-and-caregiver-benefits/education-and-careers/transferred-gi-bill-benefits/apply-form-22-1990e/introduction"
              text="Apply to use transferred education benefits using Form 22-1990e"
            />
          </p>
        </va-alert>
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
        <h2>Regional Processing Office mailing addresses</h2>
        <RegionalAccordion />
        <h2 className="vads-u-font-size--h2 vad-u-margin-top--0">
          What are my next steps?
        </h2>
        <p>
          After you successfully submit your form, we will review your
          documents. You should hear back within 30 days about your
          reimbursement.
        </p>
      </div>
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
