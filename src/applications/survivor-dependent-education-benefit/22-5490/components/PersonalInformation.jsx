import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { formatReadableDate } from '../helpers';

function PersonalInformation({ claimant }) {
  if (
    !claimant?.userFullName?.first ||
    !claimant?.userFullName?.last ||
    !claimant?.dob
  ) {
    return (
      <va-alert status="info">
        <h3 slot="headline">Personal Information Not Available</h3>
        <p>
          To complete this form, we need your name and date of birth. Please
          update your <a href="/profile">VA.gov profile</a> with this
          information.
        </p>
      </va-alert>
    );
  }

  const fullName = () => {
    const firstName = claimant.userFullName.first;
    const middleName = claimant.userFullName.middle || '';
    const lastName = claimant.userFullName.last;

    return `${firstName} ${middleName} ${lastName}`;
  };

  return (
    <div>
      <div className="usa-alert background-color-only personal-info-header">
        <h5>Your personal information</h5>
      </div>
      <div className="personal-info-border personal-info-text">
        <div>
          <h6>{fullName()}</h6>
          <p>
            <strong>Date of birth:</strong> {formatReadableDate(claimant.dob)}
          </p>
        </div>
      </div>
    </div>
  );
}

PersonalInformation.propTypes = {
  claimant: PropTypes.shape({
    dob: PropTypes.string,
    userFullName: PropTypes.shape({
      first: PropTypes.string,
      last: PropTypes.string,
      middle: PropTypes.string,
    }),
  }),
};

const mapStateToProps = state => ({
  claimant: state?.user?.profile,
});

export default connect(mapStateToProps)(PersonalInformation);
