import React from 'react';
import { connect } from 'react-redux';
import { formatReadableDate } from '../helpers';

function PersonalInformation({ claimant }) {
  const fullName = () => {
    const firstName = claimant?.firstName;
    const middleName = claimant?.middleName;
    const lastName = claimant?.lastName;

    return `${firstName} ${middleName} ${lastName}`;
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
            {claimant?.dateOfBirth
              ? formatReadableDate(claimant?.dateOfBirth)
              : 'Not available'}
          </p>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    claimant: state?.data?.formData?.data?.attributes?.claimant,
  };
};

export default connect(mapStateToProps)(PersonalInformation);
