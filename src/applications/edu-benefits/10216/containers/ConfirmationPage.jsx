import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { ConfirmationView } from '~/platform/forms-system/src/js/components/ConfirmationView';
import { scrollAndFocus } from 'platform/utilities/scroll';
import { setSubmission } from 'platform/forms-system/src/js/actions';
import Alert from '../components/Alert';
import GetFormHelp from '../components/GetFormHelp';
import ProcessList from '../components/ProcessList';

const CLAIM_ID = '10216ClaimId';

export const setClaimIdInLocalStage = submission => {
  if (submission?.response?.id) {
    localStorage.setItem(CLAIM_ID, JSON.stringify(submission?.response?.id));
  }
};

export const getClaimIdFromLocalStage = () => {
  return JSON.parse(localStorage.getItem(CLAIM_ID));
};

export const ConfirmationPage = ({ router, route }) => {
  const isAccredited = localStorage.getItem('isAccredited') === 'true';
  const [claimId, setClaimId] = React.useState(null);
  const form = useSelector(state => state.form || {});
  const { submission } = form;
  const submitDate = submission?.timestamp;
  const confirmationNumber = submission?.response?.confirmationNumber;

  const dispatch = useDispatch();

  const resetSubmissionStatus = () => {
    const now = new Date().getTime();

    dispatch(setSubmission('status', false));
    dispatch(setSubmission('timestamp', now));
  };

  useEffect(() => {
    const h2 = document.querySelector('#submit-steps-header');
    scrollAndFocus(h2);
  }, []);

  useEffect(
    () => {
      setClaimIdInLocalStage(submission);
      setClaimId(getClaimIdFromLocalStage());
    },
    [submission],
  );

  const goBack = e => {
    e.preventDefault();
    resetSubmissionStatus();
    router.push('/review-and-submit');
  };

  const childContent = (
    <div>
      <Alert />
      <h2
        id="submit-steps-header"
        className="vads-u-font-size--h3 vads-u-margin-bottom--2"
        data-testid="confirmation-header"
      >
        To submit your {!isAccredited ? 'forms' : 'form'}, follow the steps
        below
      </h2>
      <ProcessList isAccredited={isAccredited} id={claimId} />
      <p>
        <va-button
          secondary
          text="Print this page"
          data-testid="print-page"
          onClick={() => window.print()}
        />
      </p>
      <va-link
        onClick={goBack}
        class="screen-only vads-u-margin-top--1 vads-u-font-weight--bold"
        data-testid="back-button"
        text="Back"
        href="#"
      />
      <h2 className="vads-u-font-size--h2 vads-u-margin-top--4">
        What are my next steps?
      </h2>
      <p>
        After submitting your exemption request, we will review your submission
        within 7-10 business days. Once we complete the review, we will email
        your school a letter with the decision. If we accept your request, we
        will include a copy of WEAMS 22-1998 Report as confirmation in the
        letter. If we deny your request, we will explain the reason for
        rejection in the letter and provide further instructions for
        resubmission or additional steps.
      </p>
      {isAccredited ? (
        <va-link
          href="/"
          text="Go to VA.gov"
          class="vads-u-margin-top--1p5 vads-u-margin-bottom--2"
          data-testid="va-home-link"
        />
      ) : (
        <va-link
          href="/school-administrators/85-15-rule-enrollment-ratio"
          text="Go to VA Form 22-10215 now"
          class="vads-u-margin-top--1p5 vads-u-margin-bottom--2"
          data-testid="22-10215-link"
          external
        />
      )}
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
  isAccredited: PropTypes.bool,
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default ConfirmationPage;
