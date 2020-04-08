import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import backendServices from 'platform/user/profile/constants/backendServices';
import {
  createIsServiceAvailableSelector,
  isMultifactorEnabled,
} from 'platform/user/selectors';

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
      fetchMilitaryInformation,
      fetchPersonalInformation,
      fetchPaymentInformation,
      shouldFetchDirectDepositInformation,
    } = this.props;
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

  // content to show if the component is waiting for data to load
  loadingContent = (
    <div className="vads-u-margin-y--5">
      <LoadingIndicator setFocus message="Loading your information..." />
    </div>
  );

  // content to show after data has loaded
  // note that `children` will be passed in via React Router.
  mainContent = (
    <>
      <ProfileHeader />
      <div className="usa-grid usa-grid-full">
        <div className="usa-width-one-fourth">
          <ProfileSideNav />
        </div>
        <div className="usa-width-three-fourths">{this.props.children}</div>
      </div>
    </>
  );

  renderContent = () => {
    if (this.props.showLoader) {
      return this.loadingContent;
    }
    return this.mainContent;
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
    hasLoadedMilitaryInformation &&
    hasLoadedFullName &&
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
  fetchMilitaryInformation: fetchMilitaryInformationAction,
  fetchPersonalInformation: fetchPersonalInformationAction,
  fetchPaymentInformation: fetchPaymentInformationAction,
};

export { ProfileWrapper, mapStateToProps };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileWrapper);
