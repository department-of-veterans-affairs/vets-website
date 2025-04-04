import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ConfirmationView } from '~/platform/forms-system/src/js/components/ConfirmationView';
import environment from '~/platform/utilities/environment';
import GetFormHelp from '../components/GetFormHelp';
import { childContent } from '../helpers';

const CLAIM_ID = '10215ClaimId';

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

  const submitDate = submission.timestamp;
  const confirmationNumber = submission.response?.confirmationNumber;
  const goBack = e => {
    e.preventDefault();
    router.push('/review-and-submit');
  };
  useEffect(() => {
    setClaimIdInLocalStage(submission);
    setClaimId(getClaimIdFromLocalStage());
  }, [submission]);

  useEffect(() => {
    const h2Element = document.querySelector('.custom-classname h2');
    if (h2Element) {
      const h3 = document.createElement('h3');
      h3.innerHTML = h2Element.innerHTML;
      h2Element.parentNode.replaceChild(h3, h2Element);
    }
    return () => {
      const h3Element = document.querySelector('.custom-classname h3');
      if (h3Element) {
        const h2 = document.createElement('h2');
        h2.innerHTML = h3Element.innerHTML;
        h3Element.parentNode.replaceChild(h2, h3Element);
      }
    };
  }, []);

  return (
    <ConfirmationView
      formConfig={route?.formConfig}
      confirmationNumber={confirmationNumber}
      submitDate={submitDate}
      pdfUrl={`${environment.API_URL}/v0/education_benefits_claims/download_pdf/${claimId}`}
    >
      {childContent(
        <ConfirmationView.SavePdfDownload className="custom-classname" />,
        goBack,
      )}
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
