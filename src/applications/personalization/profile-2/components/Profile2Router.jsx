import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

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
    const routes = getRoutes(this.props.shouldShowDirectDeposit);
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
                  <Redirect
                    from={route.path}
                    key="/profile/account-security"
                    to="/profile/account-security"
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
              from="/profile"
              key="/profile/personal-information"
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
    return (
      <RequiredLoginView
        serviceRequired={backendServices.USER_PROFILE}
        user={this.props.user}
      >
        {this.renderContent()}
      </RequiredLoginView>
    );
  }
}

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
  };
};

const mapDispatchToProps = {
  fetchFullName: fetchHeroAction,
  fetchMHVAccount: fetchMHVAccountAction,
  fetchMilitaryInformation: fetchMilitaryInformationAction,
  fetchPersonalInformation: fetchPersonalInformationAction,
  fetchPaymentInformation: fetchPaymentInformationAction,
};

export { Profile2Router as Profile2, mapStateToProps };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile2Router);
