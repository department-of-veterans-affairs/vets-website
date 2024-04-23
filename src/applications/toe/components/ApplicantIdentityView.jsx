import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { YOUR_PROFILE_URL, CHANGE_YOUR_NAME } from '../constants';

function ordinalSuffix(num) {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const mod100 = num % 100;
  return (
    num + (suffixes[(mod100 - 20) % 10] || suffixes[mod100] || suffixes[0])
  );
}

function formatDateString(dateString) {
  const dateObj = new Date(dateString);
  const year = dateObj.getUTCFullYear();
  const month = dateObj.toLocaleString('en-US', {
    month: 'long',
    timeZone: 'UTC',
  });
  const day = ordinalSuffix(dateObj.getUTCDate());
  return `${month} ${day}, ${year}`;
}
const ApplicantIdentityView = ({ userFullName, dateOfBirth }) => {
  if (!userFullName || !dateOfBirth) {
    return <></>;
  }

  const formattedDateOfBirth = formatDateString(dateOfBirth);
  return (
    <>
      <h3>Review your personal information</h3>
      <p>
        We have this personal information on file for you. Any updates you make
        will change the information for your education benefits only. If you
        want to update your personal information for other VA benefits,{' '}
        <a href={YOUR_PROFILE_URL} target="_blank" rel="noopener noreferrer">
          update your information on your profile
        </a>
        .
      </p>
      <p>
        <strong>Note:</strong> If you want to request that we change your name
        or date of birth, you will need to send additional information. Learn
        more on how to{' '}
        <a href={CHANGE_YOUR_NAME} target="_blank" rel="noopener noreferrer">
          change your legal name
        </a>{' '}
        on file with VA.
      </p>
      <h4>Your Personal Information</h4>
      <p className="va-address-block">
        {userFullName.first} {userFullName.middle} {userFullName.last}
        <br />
        Date of birth: {formattedDateOfBirth}
      </p>
      <br />
    </>
  );
};

ApplicantIdentityView.propTypes = {
  dateOfBirth: PropTypes.string,
  userFullName: PropTypes.shape({
    first: PropTypes.string,
    middle: PropTypes.string,
    last: PropTypes.string,
  }),
};

const mapStateToProps = state => ({
  userFullName: state.user.profile?.userFullName,
  dateOfBirth: state.user.profile?.dob,
});

export default connect(mapStateToProps)(ApplicantIdentityView);
