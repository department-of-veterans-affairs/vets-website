import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ConfirmationPageViewITF } from '../components/ConfirmationPageViewITF';

const content = {
  headlineText: 'You’ve submitted your form',
  nextStepsText: (
    <p>We’ll review your form and contact you if we need more information.</p>
  ),
};

const ConfirmationPageITF = () => {
  const form = useSelector(state => state.form || {});
  const { submission } = form;
  const { benefitType } = form.data;
  const submitDate =
    submission.response.attributes &&
    submission.response.attributes.creationDate
      ? new Date(submission.response.attributes.creationDate)
      : null;
  const expirationDate =
    submission.response.attributes &&
    submission.response.attributes.expirationDate
      ? new Date(submission.response.attributes.expirationDate)
      : null;

  const { first, last } = form.data.veteranFullName;
  const { city, state, postalCode } = form.data.address;

  const address = { city, state, postalCode };
  const name = { first, last };

  useEffect(() => {
    sessionStorage.removeItem('formIncompleteARP');
  }, []);

  return (
    <ConfirmationPageViewITF
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

ConfirmationPageITF.propTypes = {
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

export default ConfirmationPageITF;
