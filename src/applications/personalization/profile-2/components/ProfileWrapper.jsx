import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import backendServices from 'platform/user/profile/constants/backendServices';

import {
  fetchMilitaryInformation as fetchMilitaryInformationAction,
  fetchHero as fetchHeroAction,
} from 'applications/personalization/profile360/actions';

import ProfileHeader from './ProfileHeader';
import ProfileSideNav from './ProfileSideNav';

const ProfileWrapper = ({
  children,
  fetchFullName,
  fetchMilitaryInformation,
  showLoader,
  user,
}) => {
  useEffect(
    () => {
      fetchMilitaryInformation();
      fetchFullName();
    },
    [fetchMilitaryInformation, fetchFullName],
  );

  // content to show if the component is waiting for data to load
  const loadingContent = (
    <div className="vads-u-margin-y--5">
      <LoadingIndicator setFocus message="Loading your information..." />
    </div>
  );

  // content to show after data has loaded
  // note that `children` will be passed in via React Router.
  const mainContent = (
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

  const renderContent = () => {
    if (showLoader) {
      return loadingContent;
    }
    return mainContent;
  };

  return (
    <RequiredLoginView
      serviceRequired={backendServices.USER_PROFILE}
      user={user}
    >
      {renderContent()}
    </RequiredLoginView>
  );
};

const mapStateToProps = state => {
  // this piece of state will be set if the call to load military info succeeds or fails
  const hasLoadedMilitaryInformation =
    state.vaProfile?.militaryInformation?.serviceHistory;
  // this piece of state will be set if the call to load name info succeeds or fails
  const hasLoadedFullName = state.vaProfile?.hero?.userFullName;
  const isLoading = !hasLoadedMilitaryInformation || !hasLoadedFullName;

  return {
    user: state.user,
    showLoader: isLoading,
  };
};

const mapDispatchToProps = {
  fetchMilitaryInformation: fetchMilitaryInformationAction,
  fetchFullName: fetchHeroAction,
};

export { ProfileWrapper, mapStateToProps };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileWrapper);
