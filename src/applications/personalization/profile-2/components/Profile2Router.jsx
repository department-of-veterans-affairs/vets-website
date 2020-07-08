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
    } = this.props;
    fetchMHVAccount();
    fetchMilitaryInformation();
    fetchFullName();
    fetchPersonalInformation();
    if (shouldFetchDirectDepositInformation) {
      fetchPaymentInformation();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.shouldFetchDirectDepositInformation &&
      !prevProps.shouldFetchDirectDepositInformation
    ) {
      this.props.fetchPaymentInformation();
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
    const shouldShowMilitaryInformation = this.props.user?.profile
      ?.veteranStatus?.servedInMilitary;
    const routes = getRoutes(
      this.props.shouldShowDirectDeposit,
      shouldShowMilitaryInformation,
    );
    return (
      <BrowserRouter>
        <Profile2Wrapper routes={routes}>
          <Switch>
            {/* Redirect users to Account Security to upgrade their account if they need to */}
            {routes.map(route => {
              if (
                (route.requiresLOA3 && !this.props.isLOA3) ||
                (route.requiresMVI && !this.props.isInMVI)
              ) {
                return (
                  <Redirect from={route.path} to="/profile/account-security" />
                );
              }

              if (
                route.path === '/profile/military-information' &&
                !shouldShowMilitaryInformation
              ) {
                return (
                  <Redirect from={route.path} to="/profile/account-security" />
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
              to="/profile/personal-information"
            />

            <Redirect
              exact
              from="/profile"
              to="/profile/personal-information"
            />

            {/* fallback handling: redirect to root route */}
            <Route path="*">
              <Redirect to="/profile" />
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
    console.log('This is user', this.props.user);
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
    hasLoadedMilitaryInformation &&
    hasLoadedPersonalInformation &&
    (shouldFetchDirectDepositInformation ? hasLoadedPaymentInformation : true);

  return {
    user: state.user,
    showLoader: !hasLoadedAllData,
    shouldFetchDirectDepositInformation,
    shouldShowDirectDeposit:
      shouldFetchDirectDepositInformation &&
      !isDirectDepositBlocked &&
      (isDirectDepositSetUp || isEligibleToSignUp),
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
