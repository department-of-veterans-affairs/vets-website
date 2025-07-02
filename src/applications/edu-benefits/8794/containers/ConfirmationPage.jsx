import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { scrollAndFocus } from 'platform/utilities/scroll';
import { ConfirmationView } from '~/platform/forms-system/src/js/components/ConfirmationView';
import environment from '~/platform/utilities/environment';
import { setSubmission } from 'platform/forms-system/src/js/actions';
import { childContent } from '../helpers';

const CLAIM_ID = '8794ClaimId';

export const setClaimIdInLocalStage = submission => {
  if (submission?.response?.id) {
    localStorage.setItem(CLAIM_ID, JSON.stringify(submission?.response?.id));
  }
};

export const getClaimIdFromLocalStage = () => {
  return JSON.parse(localStorage.getItem(CLAIM_ID));
};

export const ConfirmationPage = ({ router, route }) => {
  const [claimId, setClaimId] = React.useState(null);
  const form = useSelector(state => state?.form);
  const { submission } = form;
  const submitDate = submission?.timestamp;
  const confirmationNumber = submission?.response?.confirmationNumber;

  const dispatch = useDispatch();

  const resetSubmissionStatus = () => {
    const now = new Date().getTime();

    dispatch(setSubmission('status', false));
    dispatch(setSubmission('timestamp', now));
  };

  const goBack = e => {
    e.preventDefault();
    resetSubmissionStatus();
    router.push('/review-and-submit');
  };

  useEffect(
    () => {
      setClaimIdInLocalStage(submission);
      setClaimId(getClaimIdFromLocalStage());
    },
    [submission],
  );

  useEffect(() => {
    const firsth2 = document.querySelector('va-alert + h2');
    scrollAndFocus(firsth2);
  }, []);

  return (
    <ConfirmationView
      formConfig={route?.formConfig}
      confirmationNumber={confirmationNumber}
      submitDate={submitDate}
    >
      {childContent(
        `${
          environment.API_URL
        }/v0/education_benefits_claims/download_pdf/${claimId}`,
        route?.formConfig?.trackingPrefix,
        goBack,
      )}
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
