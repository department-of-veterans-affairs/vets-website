import React, { Component } from 'react';
import { Link } from 'react-router';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import backendServices from 'platform/user/profile/constants/backendServices';
import { isWideScreen } from 'platform/utilities/accessibility/index';
import { connect } from 'react-redux';

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
import { fetchPaymentInformation as fetchPaymentInformationAction } from 'applications/personalization/profile360/actions/paymentInformation';

import ProfileHeader from './ProfileHeader';
import ProfileSideNav from './ProfileSideNav';
import MobileMenuTrigger from './MobileMenuTrigger';

class ProfileWrapper extends Component {
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

  createBreadCrumbAttributes = () => {
    const { location, route } = this.props;
    const activeLocation = location?.pathname.replace('/', '');
    const childRoutes = route?.childRoutes;
    const activeRoute = childRoutes.find(
      childRoute => childRoute.path === activeLocation,
    );

    const activeRouteName = activeRoute?.name;

    return { activeLocation, activeRouteName };
  };

  // content to show after data has loaded
  // note that `children` will be passed in via React Router.
  mainContent = () => {
    const {
      activeLocation,
      activeRouteName,
    } = this.createBreadCrumbAttributes();

    // We do not want to display 'Profile' on the mobile personal-information route
    const onPersonalInformationMobile =
      this.props?.location?.pathname === '/personal-information' &&
      !isWideScreen();

    return (
      <>
        {/* Breadcrumbs */}
        <Breadcrumbs className="vads-u-padding-x--1 vads-u-padding-y--1p5 medium-screen:vads-u-padding-y--0">
          <a href="/">Home</a>
          {!onPersonalInformationMobile && <Link to="/">Profile</Link>}
          <a href={activeLocation}>{activeRouteName}</a>
        </Breadcrumbs>

        <MobileMenuTrigger />

        <div className="mobile-fixed-spacer" />
        <ProfileHeader />

        <div className="usa-grid usa-grid-full">
          <div className="usa-width-one-fourth">
            <ProfileSideNav />
          </div>
          <div className="usa-width-two-thirds vads-u-padding-bottom--4 vads-u-padding-x--1 medium-screen:vads-u-padding--0 medium-screen:vads-u-padding-bottom--6">
            {this.props.children}
          </div>
        </div>
      </>
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
  };
};

const mapDispatchToProps = {
  fetchFullName: fetchHeroAction,
  fetchMHVAccount: fetchMHVAccountAction,
  fetchMilitaryInformation: fetchMilitaryInformationAction,
  fetchPersonalInformation: fetchPersonalInformationAction,
  fetchPaymentInformation: fetchPaymentInformationAction,
};

export { ProfileWrapper, mapStateToProps };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileWrapper);
