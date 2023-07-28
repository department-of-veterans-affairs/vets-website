import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleValues } from '~/platform/site-wide/feature-toggles/selectors';
import { isLoggedIn } from '~/platform/user/selectors';
import FEATURE_FLAG_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';
import ApiError from './ApiError';
import Loading from './Loading';
import PactAct from './PactAct';
import PriorityGroup from './PriorityGroup';
import SignInPrompt from './SignInPrompt';
import {
  fetchEnrollmentStatus as fetchEnrollmentStatusFn,
  handleSignInClick as handleSignInClickFn,
} from '../actions';
import {
  priorityGroup as selectPriorityGroup,
  effectiveDate as selectEffectiveDate,
} from '../selectors';
import UnknownGroup from './UnknownGroup';

export const App = ({
  effectiveDate,
  enabled,
  error,
  fetchEnrollmentStatus,
  handleSignInClick,
  loading,
  priorityGroup,
  signedIn,
}) => {
  useEffect(() => enabled && signedIn && fetchEnrollmentStatus(), [
    enabled,
    fetchEnrollmentStatus,
    signedIn,
  ]);
  const showSignInPrompt = enabled && !error && !loading && !signedIn;
  const showLoadingIndicator = enabled && !error && loading;
  const hasPriorityGroup = !!priorityGroup;
  const showUnknownGroup =
    enabled && !error && !loading && signedIn && !hasPriorityGroup;
  const showPriorityGroup =
    enabled && !error && !loading && signedIn && hasPriorityGroup;

  console.log({ priorityGroup, effectiveDate }); // eslint-disable-line no-console
  return (
    <>
      {!enabled && <PactAct />}
      {showSignInPrompt && (
        <SignInPrompt handleSignInClick={handleSignInClick} />
      )}
      {showUnknownGroup && <UnknownGroup />}
      {showPriorityGroup && (
        <PriorityGroup
          effectiveDate={effectiveDate}
          priorityGroup={priorityGroup}
        />
      )}
      {showLoadingIndicator && <Loading />}
      {error && <ApiError />}
    </>
  );
};

App.propTypes = {
  effectiveDate: PropTypes.string,
  enabled: PropTypes.bool,
  error: PropTypes.bool,
  fetchEnrollmentStatus: PropTypes.func,
  handleSignInClick: PropTypes.func,
  loading: PropTypes.bool,
  priorityGroup: PropTypes.string,
  signedIn: PropTypes.bool,
};

App.defaultProps = {
  enabled: false,
  error: false,
  fetchEnrollmentStatus: () => {},
  handleSignInClick: () => {},
  loading: false,
  signedIn: false,
};

const mapStateToProps = state => ({
  effectiveDate: selectEffectiveDate(state),
  enabled: toggleValues(state)[FEATURE_FLAG_NAMES.showPriorityGroupAlertWidget],
  error: state?.priorityGroup?.error,
  loading: state?.priorityGroup?.loading,
  priorityGroup: selectPriorityGroup(state),
  signedIn: isLoggedIn(state),
});

const mapDispatchToProps = {
  handleSignInClick: handleSignInClickFn,
  fetchEnrollmentStatus: fetchEnrollmentStatusFn,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
