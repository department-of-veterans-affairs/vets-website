import React from 'react';
import { connect } from 'react-redux';

import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import backendServices from 'platform/user/profile/constants/backendServices';

import ProfileHeader from './ProfileHeader';
import ProfileSideNav from './ProfileSideNav';

const ProfileWrapper = ({ children, user }) => (
  <RequiredLoginView serviceRequired={backendServices.USER_PROFILE} user={user}>
    <ProfileHeader />
    <div className="usa-grid usa-grid-full">
      <div className="usa-width-one-fourth">
        <ProfileSideNav />
      </div>
      <div className="usa-width-three-fourths">{children}</div>
    </div>
  </RequiredLoginView>
);

const mapStateToProps = state => ({
  user: state.user,
});

export { ProfileWrapper };

export default connect(mapStateToProps)(ProfileWrapper);
