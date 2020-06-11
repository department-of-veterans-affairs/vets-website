import React from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import Profile2Router from 'applications/personalization/profile-2/components/Profile2Router';
import ProfileOneWrapper from 'applications/personalization/profile360/containers/VAProfileApp';
import { PROFILE_VERSION } from 'applications/personalization/profile-2/constants';

import {
  isInMVI as isInMVISelector,
  isLOA1 as isLOA1Selector,
  isLOA3 as isLOA3Selector,
} from 'platform/user/selectors';
import localStorage from 'platform/utilities/storage/localStorage';
import { selectShowProfile2 } from 'applications/personalization/profile-2/selectors';

const LoadingPage = () => (
  <div className="vads-u-margin-y--5">
    <LoadingIndicator setFocus message="Loading your information..." />
  </div>
);

const ProfilesWrapper = ({ showProfile1, isLOA1, isLOA3, isInMVI }) => {
  // On initial render, both isLOA props are false.
  // We need to make sure the proper redirect is hit,
  // so we show a loading state till one value is true.
  if (!isLOA1 && !isLOA3) {
    return <LoadingPage />;
  }

  if (showProfile1) {
    return <ProfileOneWrapper />;
  }

  return <Profile2Router isLOA3={isLOA3} isInMVI={isInMVI} />;
};

const mapStateToProps = state => {
  const profileVersion = localStorage.getItem(PROFILE_VERSION);
  const localStorageProfile1 = profileVersion === '1';
  const localStorageProfile2 = profileVersion === '2';
  const FFProfile2 = selectShowProfile2(state);
  return {
    isLOA1: isLOA1Selector(state),
    isLOA3: isLOA3Selector(state),
    isInMVI: isInMVISelector(state),
    // Feature flag for Profile 2 is false, localStorage value PROFILE_VERSION is not set to 2 OR
    // Feature flag for Profile 2 is true, localStorage value PROFILE_VERSION is set to 1
    showProfile1:
      (!FFProfile2 && !localStorageProfile2) ||
      (FFProfile2 && localStorageProfile1),
  };
};

export default connect(
  mapStateToProps,
  null,
)(ProfilesWrapper);
