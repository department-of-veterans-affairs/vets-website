import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { scrollAndFocus } from 'platform/utilities/scroll';
import { setSubmission } from 'platform/forms-system/src/js/actions';
import { ConfirmationView } from '~/platform/forms-system/src/js/components/ConfirmationView';
import environment from '~/platform/utilities/environment';
import { confirmationChildContent } from '../helpers';

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
    router.push('/review-and-submit');
  };

  useEffect(() => {
    const firsth2 = document.querySelector('va-alert + h2');
    scrollAndFocus(firsth2);
  }, []);

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
