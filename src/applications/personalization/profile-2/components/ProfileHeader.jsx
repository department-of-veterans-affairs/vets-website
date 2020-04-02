import React from 'react';

const ProfileHeader = () => (
  <div className="headerWrapper vads-u-background-color--gray-dark vads-u-color--white vads-u-margin-bottom--2 vads-u-padding-y--3 vads-u-display--flex vads-u-align-items--center vads-u-justify-content--center">
    <div className="headerContentWrapper vads-u-display--flex vads-u-align-items--center vads-u-justify-content--space-evenly">
      <div className="vads-u-padding-x--6">
        <img
          className="profileServiceBadge"
          src="/img/vic-army-symbol.png"
          alt="service badge"
        />
      </div>
      <div className="headerNameWrapper vads-u-flex-direction--column">
        <h1 className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
          Your Profile
        </h1>
        <h2 className="vads-u-font-size--h3">
          Kimberly Elizabeth Smith Washington
        </h2>
        <h3 className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
          United States Army Reserve
        </h3>
      </div>
    </div>
  </div>
);

export default ProfileHeader;
