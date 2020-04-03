import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const ProfileHeader = ({
  userFullName: { first, middle, last },
  latestBranchOfService,
}) => {
  const imagePaths = {
    A: '/img/vic-army-symbol.png',
    C: '/img/vic-cg-emblem.png',
    F: '/img/vic-air-force-coat-of-arms.png',
    N: '/img/vic-navy-emblem.png',
    M: '/img/vic-usmc-emblem.png',
    VASeal: '/img/vic-va-seal.png',
  };

  // const renderName = ({first, middle, last}) => {
  //   return (
  //   )
  // }

  return (
    <div className="vads-u-background-color--gray-dark vads-u-color--white vads-u-margin-bottom--2 vads-u-padding-y--3 vads-u-display--flex vads-u-align-items--center vads-u-justify-content--center">
      <div className="medium-screen:vads-u-flex-direction--row usa-grid usa-grid-full vads-u-display--flex vads-u-flex-direction--column vads-u-align-items--center vads-u-width--full">
        <div className="medium-screen:vads-u-padding-left--8 usa-width-one-fourth">
          {latestBranchOfService && (
            <img
              className="profileServiceBadge"
              src={imagePaths[`${latestBranchOfService}`]}
              alt="service badge"
            />
          )}
        </div>
        <div className="headerNameWrapper vads-u-flex-direction--column">
          <h1 className="medium-screen:vads-u-display--flex vads-u-display--none vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
            Your Profile
          </h1>
          <h2 className="vads-u-font-size--h3">
            {first} {middle} {last}
          </h2>
          {latestBranchOfService && (
            <h3 className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
              {/* hardcoded for now but switching to lastBranchOfService */}
              United States Army Reserve
            </h3>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  // moving to state.user.hero.userFullName
  userFullName: state.user.profile.userFullName,
});

ProfileHeader.defaultProps = {
  userFullName: {
    first: '',
    middle: '',
    last: '',
  },
  // defaulting to Army for now as placeholder
  latestBranchOfService: 'A',
};

ProfileHeader.propTypes = {
  userFullName: PropTypes.shape({
    first: PropTypes.string.isRequired,
    middle: PropTypes.string.isRequired,
    last: PropTypes.string.isRequired,
  }).isRequired,
  // defaulting to Army for now as placeholder
  latestBranchOfService: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(ProfileHeader);
