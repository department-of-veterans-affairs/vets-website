import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-last-location';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import DowntimeNotification, {
  externalServices,
  externalServiceStatus,
} from 'platform/monitoring/DowntimeNotification';
import DowntimeApproaching from 'platform/monitoring/DowntimeNotification/components/DowntimeApproaching';
import {
  initializeDowntimeWarnings,
  dismissDowntimeWarning,
} from 'platform/monitoring/DowntimeNotification/actions';

import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import backendServices from 'platform/user/profile/constants/backendServices';
import {
  createIsServiceAvailableSelector,
  isMultifactorEnabled,
  selectProfile,
  isLOA1 as isLOA1Selector,
  isLOA3 as isLOA3Selector,
  isInMPI as isInMVISelector,
  isLoggedIn,
} from 'platform/user/selectors';
import { fetchMHVAccount as fetchMHVAccountAction } from 'platform/user/profile/actions';
import {
  fetchMilitaryInformation as fetchMilitaryInformationAction,
  fetchHero as fetchHeroAction,
  fetchPersonalInformation as fetchPersonalInformationAction,
} from '@@profile/actions';
import {
  cnpDirectDepositAddressIsSetUp,
  cnpDirectDepositInformation,
  cnpDirectDepositIsBlocked,
  cnpDirectDepositIsSetUp,
  eduDirectDepositInformation,
  eduDirectDepositIsSetUp,
  showDirectDepositV2,
} from '@@profile/selectors';
import {
  fetchCNPPaymentInformation as fetchCNPPaymentInformationAction,
  fetchEDUPaymentInformation as fetchEDUPaymentInformationAction,
} from '@@profile/actions/paymentInformation';
import getRoutes from '../routes';
import { PROFILE_PATHS } from '../constants';

import ProfileWrapper from './ProfileWrapper';

class Profile extends Component {
  componentDidMount() {
    const {
      fetchFullName,
      fetchMHVAccount,
      fetchMilitaryInformation,
      fetchPersonalInformation,
      fetchCNPPaymentInformation,
      fetchEDUPaymentInformation,
      shouldFetchCNPDirectDepositInformation,
      shouldFetchEDUDirectDepositInformation,
    } = this.props;
    fetchMHVAccount();
    fetchFullName();
    fetchPersonalInformation();
    fetchMilitaryInformation();
    if (shouldFetchCNPDirectDepositInformation) {
      fetchCNPPaymentInformation();
    }
    if (shouldFetchEDUDirectDepositInformation) {
      fetchEDUPaymentInformation();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.shouldFetchCNPDirectDepositInformation &&
      !prevProps.shouldFetchCNPDirectDepositInformation
    ) {
      this.props.fetchCNPPaymentInformation();
    }
    if (
      this.props.shouldFetchEDUDirectDepositInformation &&
      !prevProps.shouldFetchEDUDirectDepositInformation
    ) {
      this.props.fetchEDUPaymentInformation();
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

  // content to show if the component is waiting for data to load. This loader
  // matches the loader shown by the RequiredLoginView component, so when the
  // RequiredLoginView is done with its loading and this function takes over, it
  // appears seamless to the user.
  loadingContent = () => (
    <div className="vads-u-margin-y--5">
      <LoadingIndicator setFocus message="Loading your information..." />
    </div>
  );

  // content to show after data has loaded
  mainContent = () => {
    const routesOptions = {
      removeDirectDeposit: !this.props.shouldShowDirectDeposit,
    };

    // We need to pass in a config to hide forbidden routes
    const routes = getRoutes(routesOptions);

    return (
      <BrowserRouter>
        <LastLocationProvider>
          <ProfileWrapper
            routes={routes}
            isLOA3={this.props.isLOA3}
            isInMVI={this.props.isInMVI}
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
      return this.loadingContent();
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
          loadingIndicator={this.loadingContent()}
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
  user: PropTypes.object.isRequired,
  showLoader: PropTypes.bool.isRequired,
  isInMVI: PropTypes.bool.isRequired,
  isLOA3: PropTypes.bool.isRequired,
  shouldFetchCNPDirectDepositInformation: PropTypes.bool.isRequired,
  shouldShowDirectDeposit: PropTypes.bool.isRequired,
  fetchFullName: PropTypes.func.isRequired,
  fetchMHVAccount: PropTypes.func.isRequired,
  fetchMilitaryInformation: PropTypes.func.isRequired,
  fetchPersonalInformation: PropTypes.func.isRequired,
  fetchCNPPaymentInformation: PropTypes.func.isRequired,
  fetchEDUPaymentInformation: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  const isEvssAvailableSelector = createIsServiceAvailableSelector(
    backendServices.EVSS_CLAIMS,
  );
  const isEvssAvailable = isEvssAvailableSelector(state);
  const isCNPDirectDepositSetUp = cnpDirectDepositIsSetUp(state);
  const isEDUDirectDepositSetUp = eduDirectDepositIsSetUp(state);
  const isCNPDirectDepositBlocked = cnpDirectDepositIsBlocked(state);
  const isEligibleToSetUpCNP = cnpDirectDepositAddressIsSetUp(state);
  const is2faEnabled = isMultifactorEnabled(state);
  const shouldFetchCNPDirectDepositInformation =
    isEvssAvailable && is2faEnabled;
  const shouldFetchEDUDirectDepositInformation =
    !!showDirectDepositV2(state) && is2faEnabled;
  const currentlyLoggedIn = isLoggedIn(state);
  const isLOA1 = isLOA1Selector(state);
  const isLOA3 = isLOA3Selector(state);

  // this piece of state will be set if the call to load military info succeeds
  // or fails:
  const hasLoadedMilitaryInformation = state.vaProfile?.militaryInformation;

  // when the call to load MHV fails, `errors` will be set to a non-null value
  // when the call succeeds, the `accountState` will be set to a non-null value
  const hasLoadedMHVInformation =
    selectProfile(state)?.mhvAccount?.errors ||
    selectProfile(state)?.mhvAccount?.accountState;

  // this piece of state will be set if the call to load personal info succeeds
  // or fails:
  const hasLoadedPersonalInformation = state.vaProfile?.personalInformation;

  // this piece of state will be set if the call to load name info succeeds or
  // fails:
  const hasLoadedFullName = state.vaProfile?.hero;

  // this piece of state will be set if the call to load name info succeeds or
  // fails:
  const hasLoadedCNPPaymentInformation = cnpDirectDepositInformation(state);

  const hasLoadedEDUPaymentInformation = eduDirectDepositInformation(state);

  const hasLoadedAllData =
    hasLoadedFullName &&
    hasLoadedMHVInformation &&
    hasLoadedPersonalInformation &&
    hasLoadedMilitaryInformation &&
    (shouldFetchCNPDirectDepositInformation
      ? hasLoadedCNPPaymentInformation
      : true) &&
    (shouldFetchEDUDirectDepositInformation
      ? hasLoadedEDUPaymentInformation
      : true);

  const showLoader =
    !hasLoadedAllData || (!isLOA3 && !isLOA1 && currentlyLoggedIn);

  const shouldShowDirectDeposit = () => {
    // if they are explicitly blocked from DD4CNP, do not show it
    if (isCNPDirectDepositBlocked) return false;
    return (
      (isLOA3 && !is2faEnabled) || // we _want_ to show the DD section to non-2FA users
      isCNPDirectDepositSetUp ||
      isEligibleToSetUpCNP ||
      isEDUDirectDepositSetUp
    );
  };

  return {
    user: state.user,
    showLoader,
    isInMVI: isInMVISelector(state),
    isLOA3,
    shouldFetchCNPDirectDepositInformation,
    shouldFetchEDUDirectDepositInformation,
    shouldShowDirectDeposit: shouldShowDirectDeposit(),
    isDowntimeWarningDismissed: state.scheduledDowntime?.dismissedDowntimeWarnings?.includes(
      'profile',
    ),
  };
};

const mapDispatchToProps = {
  fetchFullName: fetchHeroAction,
  fetchMHVAccount: fetchMHVAccountAction,
  fetchMilitaryInformation: fetchMilitaryInformationAction,
  fetchPersonalInformation: fetchPersonalInformationAction,
  fetchCNPPaymentInformation: fetchCNPPaymentInformationAction,
  fetchEDUPaymentInformation: fetchEDUPaymentInformationAction,
  initializeDowntimeWarnings,
  dismissDowntimeWarning,
};

export { Profile as ProfileUnconnected, mapStateToProps };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
