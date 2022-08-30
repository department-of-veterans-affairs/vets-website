import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { setData } from 'platform/forms-system/src/js/actions';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

import formConfig from '../config/form';
import { fetchPersonalInformation, fetchEligibility } from '../actions';
import { prefillTransformer } from '../helpers';
import { getAppData } from '../selectors';

export const App = ({
  location,
  children,
  formData,
  setFormData,
  getPersonalInfo,
  claimantInfo,
  firstName,
  getEligibility,
  eligibility,
  personalInfoFetchComplete,
  showUnverifiedUserAlert,
  user,
}) => {
  const [fetchedPersonalInfo, setFetchedPersonalInfo] = useState(false);
  const [fetchedEligibility, setFetchedEligibility] = useState(false);

  useEffect(
    () => {
      if (!user.login.currentlyLoggedIn) {
        return;
      }

      if (!fetchedPersonalInfo) {
        setFetchedPersonalInfo(true);
        getPersonalInfo(showUnverifiedUserAlert);
      } else if (!formData?.claimantId && claimantInfo.claimantId) {
        setFormData({
          ...formData,
          ...claimantInfo,
        });
      }
      // the firstName check ensures that eligibility only gets called after we have obtained claimant info
      // we need this to avoid a race condition when a user is being loaded freshly from VADIR on DGIB
      if (
        (firstName || (showUnverifiedUserAlert && personalInfoFetchComplete)) &&
        !fetchedEligibility
      ) {
        setFetchedEligibility(true);
        getEligibility();
      } else if (eligibility?.length && !formData.eligibility?.length) {
        setFormData({
          ...formData,
          eligibility,
        });
      }
    },
    [
      claimantInfo,
      eligibility,
      fetchedEligibility,
      fetchedPersonalInfo,
      firstName,
      formData,
      getEligibility,
      getPersonalInfo,
      personalInfoFetchComplete,
      setFormData,
      showUnverifiedUserAlert,
      user,
    ],
  );

  return (
    <>
      <va-breadcrumbs>
        <a href="/">Home</a>
        <a href="/education">Education and training</a>
        <a href="/education/apply-for-benefits-form-22-1990">
          Apply for education benefits
        </a>
      </va-breadcrumbs>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </>
  );
};

App.propTypes = {
  children: PropTypes.object,
  claimantInfo: PropTypes.object,
  eligibility: PropTypes.arrayOf(PropTypes.string),
  firstName: PropTypes.string,
  formData: PropTypes.object,
  getEligibility: PropTypes.func,
  getPersonalInfo: PropTypes.func,
  location: PropTypes.object,
  personalInfoFetchComplete: PropTypes.bool,
  setFormData: PropTypes.func,
  showUnverifiedUserAlert: PropTypes.bool,
  user: PropTypes.shape({
    login: PropTypes.shape({
      currentlyLoggedIn: PropTypes.bool,
    }),
  }),
};

const mapStateToProps = state => {
  const formData = state.form?.data || {};
  const firstName = state.data?.formData?.data?.attributes?.claimant?.firstName;
  const transformedClaimantInfo = prefillTransformer(null, null, null, state);
  const claimantInfo = transformedClaimantInfo.formData;
  return {
    ...getAppData(state),
    formData,
    firstName,
    claimantInfo,
    personalInfoFetchComplete: state.data?.personalInfoFetchComplete,
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
