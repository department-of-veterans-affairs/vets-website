import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

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
} from 'platform/user/selectors';
import { fetchMHVAccount as fetchMHVAccountAction } from 'platform/user/profile/actions';
import {
  fetchMilitaryInformation as fetchMilitaryInformationAction,
  fetchHero as fetchHeroAction,
  fetchPersonalInformation as fetchPersonalInformationAction,
} from 'applications/personalization/profile360/actions';
import {
  directDepositAddressIsSetUp,
  directDepositIsBlocked,
  directDepositIsSetUp,
} from 'applications/personalization/profile360/selectors';
import { fetchPaymentInformation as fetchPaymentInformationAction } from 'applications/personalization/profile360/actions/paymentInformation';
import getRoutes from '../routes';
import { PROFILE_PATHS } from '../constants';

import Profile2Wrapper from './Profile2Wrapper';

class Profile2Router extends Component {
  componentDidMount() {
    const {
      fetchFullName,
      fetchMHVAccount,
      fetchMilitaryInformation,
      fetchPersonalInformation,
      fetchPaymentInformation,
      shouldFetchDirectDepositInformation,
      shouldShowMilitaryInformation,
    } = this.props;
    fetchMHVAccount();
    fetchFullName();
    fetchPersonalInformation();
    if (shouldFetchDirectDepositInformation) {
      fetchPaymentInformation();
    }

    if (shouldShowMilitaryInformation) {
      fetchMilitaryInformation();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.shouldFetchDirectDepositInformation &&
      !prevProps.shouldFetchDirectDepositInformation
    ) {
      this.props.fetchPaymentInformation();
    }

    if (
      this.props.shouldShowMilitaryInformation &&
      !prevProps.shouldShowMilitaryInformation
    ) {
      this.props.fetchMilitaryInformation();
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
      removeMilitaryInformation: !this.props.shouldShowMilitaryInformation,
    };

    // We need to pass in a config to hide forbidden routes
    const routes = getRoutes(routesOptions);

    return (
      <BrowserRouter>
        <Profile2Wrapper
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

              if (
                route.path === PROFILE_PATHS.MILITARY_INFORMATION &&
                !this.props.shouldShowMilitaryInformation
              ) {
                return (
                  <Redirect to={PROFILE_PATHS.PROFILE_ROOT} key={route.path} />
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
        </Profile2Wrapper>
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
            externalServices.vet360,
          ]}
        >
          {this.renderContent()}
        </DowntimeNotification>
      </RequiredLoginView>
    );
  }
}

Profile2Router.propTypes = {
  user: PropTypes.object.isRequired,
  showLoader: PropTypes.bool.isRequired,
  shouldFetchDirectDepositInformation: PropTypes.bool.isRequired,
  shouldShowDirectDeposit: PropTypes.bool.isRequired,
  shouldShowMilitaryInformation: PropTypes.bool.isRequired,
  fetchFullName: PropTypes.func.isRequired,
  fetchMHVAccount: PropTypes.func.isRequired,
  fetchMilitaryInformation: PropTypes.func.isRequired,
  fetchPersonalInformation: PropTypes.func.isRequired,
  fetchPaymentInformation: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  const isEvssAvailableSelector = createIsServiceAvailableSelector(
    backendServices.EVSS_CLAIMS,
  );
  const isEvssAvailable = isEvssAvailableSelector(state);
  const isDirectDepositSetUp = directDepositIsSetUp(state);
  const isDirectDepositBlocked = directDepositIsBlocked(state);
  const isEligibleToSignUp = directDepositAddressIsSetUp(state);
  const is2faEnabled = isMultifactorEnabled(state);
  const shouldFetchDirectDepositInformation = isEvssAvailable && is2faEnabled;
  const shouldShowMilitaryInformation =
    selectProfile(state)?.veteranStatus?.servedInMilitary || false;

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
  const hasLoadedPaymentInformation = state.vaProfile?.paymentInformation;

  const hasLoadedAllData =
    hasLoadedFullName &&
    hasLoadedMHVInformation &&
    hasLoadedPersonalInformation &&
    (shouldShowMilitaryInformation ? hasLoadedMilitaryInformation : true) &&
    (shouldFetchDirectDepositInformation ? hasLoadedPaymentInformation : true);

  return {
    user: state.user,
    showLoader: !hasLoadedAllData,
    shouldFetchDirectDepositInformation,
    shouldShowDirectDeposit:
      shouldFetchDirectDepositInformation &&
      !isDirectDepositBlocked &&
      (isDirectDepositSetUp || isEligibleToSignUp),
    shouldShowMilitaryInformation,
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
  fetchPaymentInformation: fetchPaymentInformationAction,
  initializeDowntimeWarnings,
  dismissDowntimeWarning,
};

export { Profile2Router as Profile2, mapStateToProps };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile2Router);
