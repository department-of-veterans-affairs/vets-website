import React from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileSideNav from './ProfileSideNav';

const ProfileWrapper = ({ children }) => (
  <>
    <ProfileHeader />
    <div className="usa-grid usa-grid-full">
      <div className="usa-width-one-fourth">
        <ProfileSideNav />
      </div>
      <div className="usa-width-three-fourths">{children}</div>
    </div>
  </>
);

export default ProfileWrapper;
