import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import environment from 'platform/utilities/environment';
import GetFormHelp from '../components/GetFormHelp';
import { childContent } from '../helpers';

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
  useEffect(() => {
    const h2 = document.querySelector('.custom-classname h2');
    const h3 = document.createElement('h3');
    h3.innerHTML = h2.innerHTML;
    h2.parentNode.replaceChild(h3, h2);
  }, []);

  return (
    <ConfirmationView
      formConfig={route?.formConfig}
      confirmationNumber={confirmationNumber}
      submitDate={submitDate}
      pdfUrl={`${
        environment.API_URL
      }/v0/education_benefits_claims/download_pdf/${claimId}`}
    >
      {/* {childContent(
        <ConfirmationView.SavePdfDownload className="custom-classname" />,
        goBack,
      )} */}
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
