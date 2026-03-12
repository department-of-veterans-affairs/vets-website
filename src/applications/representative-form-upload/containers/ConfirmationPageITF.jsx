import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ConfirmationPageViewITF } from '../components/ConfirmationPageViewITF';

const ConfirmationPageITF = () => {
  const form = useSelector(state => state.form || {});
  const { submission } = form;
  const benefitType =
    form.data.isVeteran === 'no' ? 'survivor' : form.data.benefitType;
  const submitDate = submission.response?.attributes?.creationDate
    ? new Date(submission.response.attributes.creationDate)
    : null;
  const expirationDate = submission.response?.attributes?.expirationDate
    ? new Date(submission.response.attributes.expirationDate)
    : null;

  const { first, last } =
    form.data.isVeteran === 'no'
      ? form.data.claimantSubPage.claimantFullName
      : form.data.veteranSubPage.veteranFullName;
  const { city, state, postalCode } = form.data.veteranSubPage.address;

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
      address={address}
      name={name}
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
