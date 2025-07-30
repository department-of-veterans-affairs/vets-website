import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { formatReadableDate } from '../helpers';

function PersonalInformation({ claimant }) {
  const fullName = () => {
    const firstName = claimant?.userFullName?.first;
    const middleName = claimant?.userFullName?.middle || '';
    const lastName = claimant?.userFullName?.last;

    if (firstName && lastName) {
      return `${firstName} ${middleName} ${lastName}`;
    }
    return 'Not available';
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

PersonalInformation.defaultProps = {
  claimant: {
    dob: '',
    userFullName: {
      first: '',
      last: '',
      middle: '',
    },
  },
};

const mapStateToProps = state => ({
  claimant: state?.user?.profile,
});

export default connect(mapStateToProps)(PersonalInformation);
