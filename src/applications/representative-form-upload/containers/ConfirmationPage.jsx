import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ConfirmationPageView } from '../components/ConfirmationPageView';

const content = {
  headlineText: 'You’ve submitted your form',
  nextStepsText: (
    <p>We’ll review your form and contact you if we need more information.</p>
  ),
};

const ConfirmationPage = () => {
  const form = useSelector(state => state.form || {});
  const { submission } = form;
  const { benefitType } = form.data;
  const submitDate = new Date(submission.response.attributes.creationDate);
  const expirationDate = new Date(
    submission.response.attributes.expirationDate,
  );

  const { first, last } = form.data.veteranFullName;
  const { city, state, postalCode } = form.data.address;

  const address = { city, state, postalCode };
  const name = { first, last };

  useEffect(() => {
    sessionStorage.removeItem('formIncompleteARP');
  }, []);

  return (
    <ConfirmationPageView
      submitDate={submitDate}
      expirationDate={expirationDate}
      benefitType={benefitType}
      content={content}
      address={address}
      name={name}
      childContent={<></>}
    />
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      veteran: PropTypes.shape({
        fullName: PropTypes.shape({
          first: PropTypes.string,
          middle: PropTypes.string,
          last: PropTypes.string,
        }).isRequired,
      }),
    }),
    submission: PropTypes.shape({
      response: PropTypes.shape({
        creationDate: PropTypes.string,
      }),
      timestamp: PropTypes.string,
    }),
  }),
};

export default ConfirmationPage;
