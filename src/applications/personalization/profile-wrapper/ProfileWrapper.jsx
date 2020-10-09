import React from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import Profile2Router from 'applications/personalization/profile-2/components/Profile2Router';

import {
  isInMPI as isInMVISelector,
  isLOA1 as isLOA1Selector,
  isLOA3 as isLOA3Selector,
  isLoggedIn,
} from 'platform/user/selectors';

const LoadingPage = () => (
  <div className="vads-u-margin-y--5">
    <LoadingIndicator setFocus message="Loading your information..." />
  </div>
);

const ProfileWrapper = ({ isLOA1, isLOA3, isInMVI, currentlyLoggedIn }) => {
  // On initial render, both isLOA props are false.
  // We need to make sure the proper redirect is hit,
  // so we show a loading state till one value is true.

  if (!isLOA1 && !isLOA3 && currentlyLoggedIn) {
    return <LoadingPage />;
  }

  return <Profile2Router isLOA3={isLOA3} isInMVI={isInMVI} />;
};

const mapStateToProps = state => ({
  currentlyLoggedIn: isLoggedIn(state),
  isLOA1: isLOA1Selector(state),
  isLOA3: isLOA3Selector(state),
  isInMVI: isInMVISelector(state),
});

export default connect(
  mapStateToProps,
  null,
)(ProfileWrapper);
