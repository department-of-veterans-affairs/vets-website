import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-last-location';

import {
  fetchMilitaryInformation as fetchMilitaryInformationAction,
  fetchHero as fetchHeroAction,
  fetchPersonalInformation as fetchPersonalInformationAction,
} from '@@profile/actions';
import {
  cnpDirectDepositInformation,
  showProfileLGBTQEnhancements,
} from '@@profile/selectors';
import {
  fetchCNPPaymentInformation as fetchCNPPaymentInformationAction,
  fetchEDUPaymentInformation as fetchEDUPaymentInformationAction,
} from '@@profile/actions/paymentInformation';
import { CSP_IDS } from 'platform/user/authentication/constants';
import DowntimeNotification, {
  externalServices,
  externalServiceStatus,
} from '~/platform/monitoring/DowntimeNotification';
import DowntimeApproaching from '~/platform/monitoring/DowntimeNotification/components/DowntimeApproaching';
import {
  initializeDowntimeWarnings,
  dismissDowntimeWarning,
} from '~/platform/monitoring/DowntimeNotification/actions';

import RequiredLoginView, {
  RequiredLoginLoader,
} from '~/platform/user/authorization/components/RequiredLoginView';
import backendServices from '~/platform/user/profile/constants/backendServices';
import {
  createIsServiceAvailableSelector,
  isMultifactorEnabled,
  selectProfile,
  isLOA1 as isLOA1Selector,
  isLOA3 as isLOA3Selector,
  isInMPI as isInMVISelector,
  isLoggedIn,
} from '~/platform/user/selectors';
import { signInServiceName as signInServiceNameSelector } from '~/platform/user/authentication/selectors';
import { fetchMHVAccount as fetchMHVAccountAction } from '~/platform/user/profile/actions';

import { fetchTotalDisabilityRating as fetchTotalDisabilityRatingAction } from '~/applications/personalization/rated-disabilities/actions';

import getRoutes from '../routes';
import { PROFILE_PATHS } from '../constants';

import ProfileWrapper from './ProfileWrapper';

class Profile extends Component {
  componentDidMount() {
    const {
      fetchCNPPaymentInformation,
      fetchEDUPaymentInformation,
      fetchFullName,
      fetchMHVAccount,
      fetchMilitaryInformation,
      fetchPersonalInformation,
      fetchTotalDisabilityRating,
      isLOA3,
      isInMVI,
      shouldFetchCNPDirectDepositInformation,
      shouldFetchTotalDisabilityRating,
      shouldFetchEDUDirectDepositInformation,
    } = this.props;
    fetchMHVAccount();
    if (isLOA3 && isInMVI) {
      fetchFullName();
      fetchPersonalInformation();
      fetchMilitaryInformation();
    }
    if (shouldFetchCNPDirectDepositInformation) {
      fetchCNPPaymentInformation();
    }
    if (shouldFetchTotalDisabilityRating) {
      fetchTotalDisabilityRating();
    }
    if (shouldFetchEDUDirectDepositInformation) {
      fetchEDUPaymentInformation();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      fetchCNPPaymentInformation,
      fetchEDUPaymentInformation,
      fetchFullName,
      fetchMilitaryInformation,
      fetchPersonalInformation,
      fetchTotalDisabilityRating,
      isLOA3,
      shouldFetchCNPDirectDepositInformation,
      shouldFetchEDUDirectDepositInformation,
      shouldFetchTotalDisabilityRating,
      isInMVI,
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
      shouldFetchCNPDirectDepositInformation &&
      !prevProps.shouldFetchCNPDirectDepositInformation
    ) {
      fetchCNPPaymentInformation();
    }
    if (
      shouldFetchEDUDirectDepositInformation &&
      !prevProps.shouldFetchEDUDirectDepositInformation
    ) {
      fetchEDUPaymentInformation();
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
            title: (
              <h3>
                Some parts of the profile will be down for maintenance soon
              </h3>
            ),
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
    const routesOptions = {
      shouldShowProfileLGBTQEnhancements: this.props
        .shouldShowProfileLGBTQEnhancements,
    };
    // We need to pass in a config to hide forbidden routes
    const routes = getRoutes(routesOptions);
    return (
      <BrowserRouter>
        <LastLocationProvider>
          <ProfileWrapper
            routes={routes}
            isInMVI={this.props.isInMVI}
            isLOA3={this.props.isLOA3}
          >
            <Switch>
              {/* Redirect users to Account Security to upgrade their account if they need to */}
              {routes.map(route => {
                if (
                  (route.requiresLOA3 && !this.props.isLOA3) ||
                  (route.requiresMVI && !this.props.isInMVI)
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
                to={PROFILE_PATHS.PERSONAL_INFORMATION}
              />

              <Redirect
                exact
                from={PROFILE_PATHS.PROFILE_ROOT}
                to={PROFILE_PATHS.PERSONAL_INFORMATION}
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
            externalServices.emis,
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
  fetchCNPPaymentInformation: PropTypes.func.isRequired,
  fetchEDUPaymentInformation: PropTypes.func.isRequired,
  fetchFullName: PropTypes.func.isRequired,
  fetchMHVAccount: PropTypes.func.isRequired,
  fetchMilitaryInformation: PropTypes.func.isRequired,
  fetchPersonalInformation: PropTypes.func.isRequired,
  isInMVI: PropTypes.bool.isRequired,
  isLOA3: PropTypes.bool.isRequired,
  shouldFetchCNPDirectDepositInformation: PropTypes.bool.isRequired,
  shouldShowDirectDeposit: PropTypes.bool.isRequired,
  shouldShowProfileLGBTQEnhancements: PropTypes.bool.isRequired,
  showLoader: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  const signInServicesEligibleForDD = new Set([
    CSP_IDS.ID_ME,
    CSP_IDS.LOGIN_GOV,
  ]);
  const isEvssAvailableSelector = createIsServiceAvailableSelector(
    backendServices.EVSS_CLAIMS,
  );
  const isEvssAvailable = isEvssAvailableSelector(state);
  const is2faEnabled = isMultifactorEnabled(state);
  const signInService = signInServiceNameSelector(state);
  const isInMVI = isInMVISelector(state);
  const isEligibleForDD =
    signInServicesEligibleForDD.has(signInService) && isInMVI && is2faEnabled;
  const shouldFetchCNPDirectDepositInformation =
    isEligibleForDD && isEvssAvailable;
  const shouldFetchEDUDirectDepositInformation = isEligibleForDD;
  const currentlyLoggedIn = isLoggedIn(state);
  const isLOA1 = isLOA1Selector(state);
  const isLOA3 = isLOA3Selector(state);

  const shouldFetchTotalDisabilityRating = isLOA3 && isInMVI;

  // this piece of state will be set if the call to load military info succeeds
  // or fails:
  const hasLoadedMilitaryInformation =
    isLOA1 || !isInMVI || state.vaProfile?.militaryInformation;

  // when the call to load MHV fails, `errors` will be set to a non-null value
  // when the call succeeds, the `accountState` will be set to a non-null value
  const hasLoadedMHVInformation =
    !isInMVI ||
    selectProfile(state)?.mhvAccount?.errors ||
    selectProfile(state)?.mhvAccount?.accountState;

  // this piece of state will be set if the call to load personal info succeeds
  // or fails:
  const hasLoadedPersonalInformation =
    isLOA1 || !isInMVI || state.vaProfile?.personalInformation;

  // this piece of state will be set if the call to load name info succeeds or
  // fails:
  const hasLoadedFullName = isLOA1 || !isInMVI || state.vaProfile?.hero;

  // this piece of state will be set if the call to load name info succeeds or
  // fails:
  const hasLoadedCNPPaymentInformation =
    !isInMVI || cnpDirectDepositInformation(state);

  const hasLoadedTotalDisabilityRating =
    !isInMVI || (state.totalRating && !state.totalRating.loading);

  const hasLoadedAllData =
    !isInMVI ||
    (hasLoadedFullName &&
      hasLoadedMHVInformation &&
      hasLoadedPersonalInformation &&
      hasLoadedMilitaryInformation &&
      (shouldFetchTotalDisabilityRating
        ? hasLoadedTotalDisabilityRating
        : true) &&
      (shouldFetchCNPDirectDepositInformation
        ? hasLoadedCNPPaymentInformation
        : true));

  const showLoader =
    !hasLoadedAllData || (!isLOA3 && !isLOA1 && currentlyLoggedIn);

  return {
    user: state.user,
    showLoader,
    isInMVI,
    isLOA3,
    shouldFetchCNPDirectDepositInformation,
    shouldFetchEDUDirectDepositInformation,
    shouldFetchTotalDisabilityRating,
    isDowntimeWarningDismissed: state.scheduledDowntime?.dismissedDowntimeWarnings?.includes(
      'profile',
    ),
    shouldShowProfileLGBTQEnhancements: showProfileLGBTQEnhancements(state),
  };
};

const mapDispatchToProps = {
  fetchFullName: fetchHeroAction,
  fetchMHVAccount: fetchMHVAccountAction,
  fetchMilitaryInformation: fetchMilitaryInformationAction,
  fetchPersonalInformation: fetchPersonalInformationAction,
  fetchCNPPaymentInformation: fetchCNPPaymentInformationAction,
  fetchEDUPaymentInformation: fetchEDUPaymentInformationAction,
  fetchTotalDisabilityRating: fetchTotalDisabilityRatingAction,
  initializeDowntimeWarnings,
  dismissDowntimeWarning,
};

export { Profile as ProfileUnconnected, mapStateToProps };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
