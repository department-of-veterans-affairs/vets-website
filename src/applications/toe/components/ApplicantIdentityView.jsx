import React from 'react';
import PropTypes from 'prop-types';
import { formFields, YOUR_PROFILE_URL, CHANGE_YOUR_NAME } from '../constants';

const ApplicantIdentityView = ({ formData }) => {
  const fullName =
    formData[formFields.viewUserFullName]?.[formFields.userFullName];
  const dateOfBirth = formData[formFields.dateOfBirth];

  return (
    <>
      <h3>Review your personal information</h3>
      <p>
        We have this personal information on file for you. Any updates you make
        will change the information for your education benefits only. If you
        want to update your personal information for other VA benefits,{' '}
        <a href={YOUR_PROFILE_URL}>update your information on your profile</a>.
      </p>
      <p>
        <strong>Note:</strong> If you want to request that we change your name
        or date of birth, you will need to send additional information. Learn
        more on how to <a href={CHANGE_YOUR_NAME}>change your legal name</a> on
        file with VA.
      </p>
      <h4>Your Personal Information</h4>
      <p className="va-address-block">
        {fullName} <br />
        Date of birth: {dateOfBirth}
      </p>
    </>
  );
};
ApplicantIdentityView.propTypes = {
  formData: PropTypes.shape({
    [formFields.viewUserFullName]: PropTypes.shape({
      [formFields.userFullName]: PropTypes.string,
    }),
    [formFields.dateOfBirth]: PropTypes.string,
  }),
};
export default ApplicantIdentityView;
