import React, { Component } from 'react';
import { connect } from 'react-redux';
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
import { fetchPaymentInformation as fetchPaymentInformationAction } from 'applications/personalization/profile360/actions/paymentInformation';

import ProfileHeader from './ProfileHeader';
import ProfileSideNav from './ProfileSideNav';

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

  // content to show after data has loaded
  // note that `children` will be passed in via React Router.
  mainContent = () => (
    <>
      {/* the mobile sidenav trigger button */}
      <button
        type="button"
        className="va-btn-sidebarnav-trigger"
        aria-controls="va-detailpage-sidebar"
      >
        <span>
          <b>Profile Menu</b>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="444.819"
            height="444.819"
            viewBox="0 0 444.819 444.819"
          >
            <path
              fill="#ffffff"
              d="M352.025 196.712L165.885 10.848C159.028 3.615 150.468 0 140.185 0s-18.84 3.62-25.696 10.848l-21.7 21.416c-7.045 7.043-10.567 15.604-10.567 25.692 0 9.897 3.52 18.56 10.566 25.98L231.544 222.41 92.785 361.168c-7.04 7.043-10.563 15.604-10.563 25.693 0 9.9 3.52 18.566 10.564 25.98l21.7 21.417c7.043 7.043 15.612 10.564 25.697 10.564 10.09 0 18.656-3.52 25.697-10.564L352.025 248.39c7.046-7.423 10.57-16.084 10.57-25.98.002-10.09-3.524-18.655-10.57-25.698z"
            />
          </svg>
        </span>
      </button>
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
