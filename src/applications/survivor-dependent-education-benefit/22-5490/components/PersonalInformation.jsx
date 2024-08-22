import React from 'react';
import { connect } from 'react-redux';
import { formatReadableDate } from '../helpers';

function PersonalInformation({ claimant }) {
  const fullName = () => {
    const firstName = claimant?.userFullName?.first;
    const middleName = claimant?.userFullName?.middle;
    const lastName = claimant?.userFullName?.last;

    if (firstName && lastName) {
      return `${firstName} ${middleName} ${lastName}`;
    }
    return 'Not available';
  };

  return (
    <div>
      <div className="usa-alert background-color-only personal-info-header">
        <h5>Your Personal Information</h5>
      </div>
      <div className="personal-info-border personal-info-text">
        <div>
          <h6>{fullName()}</h6>
          <p>
            <strong>Date of birth:</strong>{' '}
            {claimant?.dob
              ? formatReadableDate(claimant?.dob)
              : 'Not available'}
          </p>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    claimant: state?.user?.profile,
  };
};

export default connect(mapStateToProps)(PersonalInformation);
