import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import { fetchPersonalInformation, fetchEligibility } from '../actions';
import { fetchUser } from '../selectors/userDispatch';
import { personalInfoFetchProgress } from '../selectors/personalInfoFetchInProgress';

export const App = ({
  location,
  children,
  formData,
  setFormData,
  getPersonalInfo,
  firstName,
  getEligibility,
  eligibility,
  user,
  personalInfoFetchInProgress,
}) => {
  useEffect(
    () => {
      if (user.login.currentlyLoggedIn && !personalInfoFetchInProgress) {
        if (!firstName) {
          getPersonalInfo();
        }
        if (!eligibility) {
          getEligibility();
        } else if (!formData.eligibility) {
          setFormData({
            ...formData,
            eligibility,
          });
        }
      }
    },
    [
      formData,
      setFormData,
      firstName,
      getPersonalInfo,
      getEligibility,
      eligibility,
      user,
      personalInfoFetchInProgress,
    ],
  );

  return (
    <>
      <Breadcrumbs>
        <a href="/">Home</a>
        <a href="/education">Education and training</a>
        <a href="/education/apply-for-benefits-form-22-1990">
          Apply for education benefits
        </a>
      </Breadcrumbs>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </>
  );
};

const mapStateToProps = state => {
  const formData = state.form?.data || {};
  const firstName = state.data?.formData?.data?.attributes?.claimant?.firstName;
  const eligibility = state.data?.eligibility;
  const user = fetchUser(state);
  const personalInfoFetchInProgress = personalInfoFetchProgress(state);
  return {
    formData,
    firstName,
    eligibility,
    user,
    personalInfoFetchInProgress,
  };
};

const mapDispatchToProps = {
  setFormData: setData,
  getPersonalInfo: fetchPersonalInformation,
  getEligibility: fetchEligibility,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
