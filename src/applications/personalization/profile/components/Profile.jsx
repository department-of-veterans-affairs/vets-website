import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-last-location';

import {
  fetchMilitaryInformation as fetchMilitaryInformationAction,
  fetchHero as fetchHeroAction,
} from '@@profile/actions';

import {
  selectProfileToggles,
  selectIsBlocked,
  togglesAreLoaded,
} from '@@profile/selectors';

import { fetchPersonalInformation as fetchPersonalInformationAction } from '~/platform/user/profile/vap-svc/actions/personalInformation';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import DowntimeNotification, {
  externalServices,
  externalServiceStatus,
} from '~/platform/monitoring/DowntimeNotification';
import DowntimeApproaching from '~/platform/monitoring/DowntimeNotification/components/DowntimeApproaching';
import {
  initializeDowntimeWarnings,
  dismissDowntimeWarning,
} from '~/platform/monitoring/DowntimeNotification/actions';

import {
  RequiredLoginView,
  RequiredLoginLoader,
} from '~/platform/user/authorization/components/RequiredLoginView';
import backendServices from '~/platform/user/profile/constants/backendServices';
import {
  createIsServiceAvailableSelector,
  isMultifactorEnabled,
  isLOA1 as isLOA1Selector,
  isLOA3 as isLOA3Selector,
  isInMPI as isInMVISelector,
  isLoggedIn,
} from '~/platform/user/selectors';
import { signInServiceName as signInServiceNameSelector } from '~/platform/user/authentication/selectors';
import { connectDrupalSourceOfTruthCerner as dispatchConnectDrupalSourceOfTruthCerner } from '~/platform/utilities/cerner/dsot';

import { fetchTotalDisabilityRating as fetchTotalDisabilityRatingAction } from '../../common/actions/ratedDisabilities';

import getRoutes from '../routes';
import { PROFILE_PATHS } from '../constants';

import ProfileWrapper from './ProfileWrapper';
import { canAccess } from '../../common/selectors';
import { fetchDirectDeposit as fetchDirectDepositAction } from '../actions/directDeposit';

class Profile extends Component {
  componentDidMount() {
    const {
      fetchDirectDeposit,
      fetchFullName,
      fetchMilitaryInformation,
      fetchPersonalInformation,
      fetchTotalDisabilityRating,
      isLOA3,
      isInMVI,
      shouldFetchDirectDeposit,
      shouldFetchTotalDisabilityRating,
      connectDrupalSourceOfTruthCerner,
      togglesLoaded,
    } = this.props;
    connectDrupalSourceOfTruthCerner();
    if (isLOA3 && isInMVI) {
      fetchFullName();
      fetchPersonalInformation();
      fetchMilitaryInformation();
    }

    if (togglesLoaded && shouldFetchDirectDeposit) {
      fetchDirectDeposit();
    }

    if (shouldFetchTotalDisabilityRating) {
      fetchTotalDisabilityRating();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      fetchDirectDeposit,
      fetchFullName,
      fetchMilitaryInformation,
      fetchPersonalInformation,
      fetchTotalDisabilityRating,
      isLOA3,
      shouldFetchDirectDeposit,
      shouldFetchTotalDisabilityRating,
      isInMVI,
      togglesLoaded,
    } = this.props;
    if (isLOA3 && !prevProps.isLOA3 && isInMVI) {
      fetchFullName();
      fetchPersonalInformation();
      fetchMilitaryInformation();
    }

    if (
      shouldFetchTotalDisabilityRating &&
      !prevProps.shouldFetchTotalDisabilityRating
    ) {
      fetchTotalDisabilityRating();
    }

    if (
      (togglesLoaded && !prevProps.togglesLoaded && shouldFetchDirectDeposit) ||
      (togglesLoaded &&
        shouldFetchDirectDeposit &&
        !prevProps.shouldFetchDirectDeposit)
    ) {
      fetchDirectDeposit();
    }
  }

  handleDowntimeApproaching = (downtime, children) => {
    if (downtime.status === externalServiceStatus.downtimeApproaching) {
      return (
        <DowntimeApproaching
          {...downtime}
          appTitle="profile"
          isDowntimeWarningDismissed={this.props.isDowntimeWarningDismissed}
          dismissDowntimeWarning={this.props.dismissDowntimeWarning}
          initializeDowntimeWarnings={this.props.initializeDowntimeWarnings}
          messaging={{
            title:
              'Some parts of the profile will be down for maintenance soon',
          }}
          // default for className prop is `row-padded` and we do not want that
          // class applied to the wrapper div DowntimeApproaching renders
          className=""
          content={children}
        />
      );
    }
    return children;
  };

  // content to show after data has loaded
  mainContent = () => {
    const routes = getRoutes();

    return (
      <BrowserRouter>
        <LastLocationProvider>
          <ProfileWrapper
            isInMVI={this.props.isInMVI}
            isLOA3={this.props.isLOA3}
            isBlocked={this.props.isBlocked}
          >
            <Switch>
              {/* Redirect users to Account Security to upgrade their account if they need to */}
              {routes.map(route => {
                if (
                  (route.requiresLOA3 && !this.props.isLOA3) ||
                  (route.requiresMVI && !this.props.isInMVI) ||
                  (route.requiresLOA3 && this.props.isBlocked)
                ) {
                  return (
                    <Redirect
                      from={route.path}
                      to={PROFILE_PATHS.ACCOUNT_SECURITY}
                      key={route.path}
                    />
                  );
                }

                return (
                  <Route
                    component={route.component}
                    exact
                    key={route.path}
                    path={route.path}
                  />
                );
              })}

              <Redirect
                exact
                from="/profile#contact-information"
                to={PROFILE_PATHS.CONTACT_INFORMATION}
              />

              {/* fallback handling: redirect to root route */}
              {/* Should we consider making a 404 page for this instead? */}
              <Route path="*">
                <Redirect to={PROFILE_PATHS.PROFILE_ROOT} />
              </Route>
            </Switch>
          </ProfileWrapper>
        </LastLocationProvider>
      </BrowserRouter>
    );
  };

  renderContent = () => {
    if (this.props.showLoader) {
      return <RequiredLoginLoader />;
    }
    return this.mainContent();
  };

  render() {
    return (
      <RequiredLoginView
        serviceRequired={backendServices.USER_PROFILE}
        user={this.props.user}
      >
        <DowntimeNotification
          appTitle="profile"
          render={this.handleDowntimeApproaching}
          loadingIndicator={<RequiredLoginLoader />}
          dependencies={[
            externalServices.evss,
            externalServices.mvi,
            externalServices.vaProfile,
          ]}
        >
          {this.renderContent()}
        </DowntimeNotification>
      </RequiredLoginView>
    );
  }
}

Profile.propTypes = {
  connectDrupalSourceOfTruthCerner: PropTypes.func.isRequired,
  dismissDowntimeWarning: PropTypes.func.isRequired,
  fetchCNPPaymentInformation: PropTypes.func.isRequired,
  fetchDirectDeposit: PropTypes.func.isRequired,
  fetchEDUPaymentInformation: PropTypes.func.isRequired,
  fetchFullName: PropTypes.func.isRequired,
  fetchMilitaryInformation: PropTypes.func.isRequired,
  fetchPersonalInformation: PropTypes.func.isRequired,
  fetchTotalDisabilityRating: PropTypes.func.isRequired,
  initializeDowntimeWarnings: PropTypes.func.isRequired,
  isBlocked: PropTypes.bool.isRequired,
  isDowntimeWarningDismissed: PropTypes.bool.isRequired,
  isInMVI: PropTypes.bool.isRequired,
  isLOA3: PropTypes.bool.isRequired,
  profileToggles: PropTypes.object.isRequired,
  shouldFetchCNPDirectDepositInformation: PropTypes.bool.isRequired,
  shouldFetchDirectDeposit: PropTypes.bool.isRequired,
  shouldFetchEDUDirectDepositInformation: PropTypes.bool.isRequired,
  shouldFetchTotalDisabilityRating: PropTypes.bool.isRequired,
  showLoader: PropTypes.bool.isRequired,
  togglesLoaded: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  const togglesLoaded = togglesAreLoaded(state);
  const profileToggles = selectProfileToggles(state);
  const signInServicesEligibleForDD = new Set([
    CSP_IDS.ID_ME,
    CSP_IDS.LOGIN_GOV,
  ]);
  const isLighthouseAvailableSelector = createIsServiceAvailableSelector(
    backendServices.LIGHTHOUSE,
  );
  const isLighthouseAvailable = isLighthouseAvailableSelector(state);
  const is2faEnabled = isMultifactorEnabled(state);
  const signInService = signInServiceNameSelector(state);
  const isInMVI = isInMVISelector(state);
  const isEligibleForDD =
    signInServicesEligibleForDD.has(signInService) && isInMVI && is2faEnabled;
  const currentlyLoggedIn = isLoggedIn(state);
  const isLOA1 = isLOA1Selector(state);
  const isLOA3 = isLOA3Selector(state);
  const shouldFetchDirectDeposit =
    isEligibleForDD &&
    isLighthouseAvailable &&
    !profileToggles?.profileHideDirectDeposit;

  // block profile access for deceased, fiduciary flagged, and incompetent veterans
  const isBlocked = selectIsBlocked(state);

  const shouldFetchTotalDisabilityRating = !!(
    isLOA3 &&
    isInMVI &&
    canAccess(state)?.ratingInfo
  );

  // this piece of state will be set if the call to load military info succeeds
  // or fails:
  const hasLoadedMilitaryInformation =
    isLOA1 || !isInMVI || state.vaProfile?.militaryInformation;

  // this piece of state will be set if the call to load personal info succeeds
  // or fails:
  const hasLoadedPersonalInformation =
    isLOA1 || !isInMVI || state.vaProfile?.personalInformation;

  // this piece of state will be set if the call to load name info succeeds or
  // fails:
  const hasLoadedFullName = isLOA1 || !isInMVI || state.vaProfile?.hero;

  const hasLoadedDirectDeposit =
    !isInMVI ||
    state.directDeposit?.paymentAccount ||
    state.directDeposit?.loadError;

  const hasLoadedTotalDisabilityRating =
    !isInMVI || (state.totalRating && !state.totalRating.loading);

  const hasLoadedAllData =
    !isInMVI ||
    (hasLoadedFullName &&
      hasLoadedPersonalInformation &&
      hasLoadedMilitaryInformation &&
      (shouldFetchTotalDisabilityRating
        ? hasLoadedTotalDisabilityRating
        : true) &&
      (shouldFetchDirectDeposit ? hasLoadedDirectDeposit : true));

  const showLoader =
    !hasLoadedAllData || (!isLOA3 && !isLOA1 && currentlyLoggedIn);

  return {
    user: state.user,
    showLoader,
    isInMVI,
    isLOA3,
    shouldFetchDirectDeposit,
    shouldFetchTotalDisabilityRating,
    isDowntimeWarningDismissed: state.scheduledDowntime?.dismissedDowntimeWarnings?.includes(
      'profile',
    ),
    isBlocked,
    togglesLoaded,
    profileToggles,
  };
};

const mapDispatchToProps = {
  fetchFullName: fetchHeroAction,
  fetchMilitaryInformation: fetchMilitaryInformationAction,
  fetchPersonalInformation: fetchPersonalInformationAction,
  fetchDirectDeposit: fetchDirectDepositAction,
  fetchTotalDisabilityRating: fetchTotalDisabilityRatingAction,
  initializeDowntimeWarnings,
  dismissDowntimeWarning,
  connectDrupalSourceOfTruthCerner: () =>
    dispatchConnectDrupalSourceOfTruthCerner,
};

export { Profile as ProfileUnconnected, mapStateToProps };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
