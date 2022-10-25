import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { setData } from 'platform/forms-system/src/js/actions';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

import formConfig from '../config/form';
import {
  fetchPersonalInformation,
  fetchEligibility,
  fetchDirectDeposit,
} from '../actions';
import { formFields } from '../constants';
import { prefillTransformer } from '../helpers';
import { getAppData } from '../selectors/selectors';

export const App = ({
  children,
  claimantInfo,
  eligibility,
  featureTogglesLoaded,
  firstName,
  formData,
  getDirectDeposit,
  getEligibility,
  getPersonalInfo,
  isLOA3,
  isLoggedIn,
  location,
  setFormData,
  showMebDgi40Features,
  showUnverifiedUserAlert,
}) => {
  const [fetchedPersonalInfo, setFetchedPersonalInfo] = useState(false);
  const [fetchedEligibility, setFetchedEligibility] = useState(false);
  const [fetchedDirectDeposit, setFetchedDirectDeposit] = useState(false);

  useEffect(
    () => {
      if (
        !isLoggedIn ||
        !featureTogglesLoaded ||
        (showUnverifiedUserAlert && isLOA3 !== true)
      ) {
        return;
      }

      if (!fetchedPersonalInfo) {
        setFetchedPersonalInfo(true);
        getPersonalInfo();
      } else if (!formData[formFields.claimantId] && claimantInfo.claimantId) {
        setFormData({
          ...formData,
          ...claimantInfo,
        });
      }
    },
    [
      claimantInfo,
      featureTogglesLoaded,
      fetchedPersonalInfo,
      formData,
      getPersonalInfo,
      isLOA3,
      isLoggedIn,
      setFormData,
      showUnverifiedUserAlert,
    ],
  );

  useEffect(
    () => {
      if (
        !isLoggedIn ||
        !featureTogglesLoaded ||
        (showUnverifiedUserAlert && isLOA3 !== true)
      ) {
        return;
      }

      // the firstName check ensures that eligibility only gets called after we have obtained claimant info
      // we need this to avoid a race condition when a user is being loaded freshly from VADIR on DGIB
      if (firstName && !fetchedEligibility) {
        setFetchedEligibility(true);
        getEligibility();
      } else if (eligibility && !formData.eligibility) {
        setFormData({
          ...formData,
          eligibility,
        });
      }
    },
    [
      eligibility,
      featureTogglesLoaded,
      fetchedEligibility,
      firstName,
      formData,
      getEligibility,
      isLOA3,
      isLoggedIn,
      setFormData,
      showUnverifiedUserAlert,
    ],
  );

  useEffect(
    () => {
      if (showMebDgi40Features !== formData.showMebDgi40Features) {
        setFormData({
          ...formData,
          showMebDgi40Features,
        });
      }
    },
    [formData, setFormData, showMebDgi40Features],
  );

  useEffect(
    () => {
      if (!isLoggedIn) {
        return;
      }
      if (!fetchedDirectDeposit) {
        setFetchedDirectDeposit(true);
        getDirectDeposit();
      }
    },
    [fetchedDirectDeposit, getDirectDeposit, isLoggedIn],
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
  featureTogglesLoaded: PropTypes.bool,
  firstName: PropTypes.string,
  formData: PropTypes.object,
  getDirectDeposit: PropTypes.func,
  getEligibility: PropTypes.func,
  getPersonalInfo: PropTypes.func,
  isLOA3: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  location: PropTypes.object,
  setFormData: PropTypes.func,
  showMebDgi40Features: PropTypes.bool,
  showUnverifiedUserAlert: PropTypes.bool,
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
  };
};

const mapDispatchToProps = {
  getDirectDeposit: fetchDirectDeposit,
  getEligibility: fetchEligibility,
  setFormData: setData,
  getPersonalInfo: fetchPersonalInformation,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
