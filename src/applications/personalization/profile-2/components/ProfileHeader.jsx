import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';

import { SERVICE_BADGE_IMAGE_PATHS } from '../constants';
import { getServiceBranchDisplayName } from '../helpers';

const ProfileHeader = ({
  userFullName: { first, middle, last, suffix },
  latestBranchOfService,
  showBadgeImage,
}) => {
  const fullName = [first, middle, last, suffix]
    .filter(name => !!name)
    .join(' ');

  return (
    <div className="vads-u-background-color--gray-dark vads-u-color--white vads-u-margin-bottom--2 vads-u-padding-y--3 vads-u-display--flex vads-u-align-items--center vads-u-justify-content--center">
      <div className="medium-screen:vads-u-flex-direction--row usa-grid usa-grid-full vads-u-display--flex vads-u-flex-direction--column vads-u-align-items--center vads-u-width--full">
        <div className="medium-screen:vads-u-padding-left--8 usa-width-one-fourth">
          {showBadgeImage && (
            <img
              className="profileServiceBadge"
              src={SERVICE_BADGE_IMAGE_PATHS.get(latestBranchOfService)}
              alt="service badge"
            />
          )}
        </div>
        <div className="headerNameWrapper vads-u-flex-direction--column">
          <h1 className="medium-screen:vads-u-display--flex vads-u-display--none vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
            Your Profile
          </h1>
          <h2 className="vads-u-font-size--h3">{fullName}</h2>
          {latestBranchOfService && (
            <h3 className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
              {getServiceBranchDisplayName(latestBranchOfService)}
            </h3>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  const latestBranchOfService = orderBy(
    state.vaProfile?.militaryInformation?.serviceHistory?.serviceHistory,
    ['endDate'],
    'desc',
  )[0]?.branchOfService;

  return {
    userFullName: state.vaProfile?.hero?.userFullName,
    latestBranchOfService,
    showBadgeImage: SERVICE_BADGE_IMAGE_PATHS.has(latestBranchOfService),
  };
};

ProfileHeader.defaultProps = {
  userFullName: {
    first: '',
    middle: '',
    last: '',
    suffix: '',
  },
  latestBranchOfService: '',
};

ProfileHeader.propTypes = {
  userFullName: PropTypes.shape({
    first: PropTypes.string,
    middle: PropTypes.string,
    last: PropTypes.string,
    suffix: PropTypes.string,
  }).isRequired,
  latestBranchOfService: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(ProfileHeader);
