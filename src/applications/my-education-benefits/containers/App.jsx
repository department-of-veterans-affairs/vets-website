import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { setData } from 'platform/forms-system/src/js/actions';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

import formConfig from '../config/form';
import {
  fetchPersonalInformation,
  fetchEligibility,
  fetchDuplicateContactInfo,
  // fetchDirectDeposit, Commenting out until we update the component to handle astrisks see TOE app
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
  // Commenting out until we update the component to handle astrisks
  // getDirectDeposit,
  getEligibility,
  getPersonalInfo,
  getDuplicateContactInfo,
  isLOA3,
  isLoggedIn,
  location,
  setFormData,
  showMebDgi40Features,
  showMebDgi42Features,
  showMebCh33SelfForm,
  showMebEnhancements,
  showMebEnhancements06,
  email,
  mobilePhone,
}) => {
  const [fetchedPersonalInfo, setFetchedPersonalInfo] = useState(false);
  const [fetchedEligibility, setFetchedEligibility] = useState(false);
  const [fetchedContactInfo, setFetchedContactInfo] = useState(false);

  // Commenting out next line until component can handle astrisks (See TOE app)
  // const [fetchedDirectDeposit, setFetchedDirectDeposit] = useState(false);

  useEffect(
    () => {
      if (!isLoggedIn || !featureTogglesLoaded || isLOA3 !== true) {
        return;
      }

      if (!fetchedPersonalInfo || !fetchedContactInfo) {
        setFetchedPersonalInfo(true);
        setFetchedContactInfo(true);
        getPersonalInfo(showMebCh33SelfForm);
      } else if (!formData[formFields.claimantId] && claimantInfo?.claimantId) {
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
      showMebCh33SelfForm,
    ],
  );

  useEffect(
    () => {
      if (!isLoggedIn || !featureTogglesLoaded || isLOA3 !== true) {
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
      showMebDgi40Features,
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
      if (showMebDgi42Features !== formData.showMebDgi42Features) {
        setFormData({
          ...formData,
          showMebDgi42Features,
        });
      }
      if (showMebCh33SelfForm !== formData.showMebCh33SelfForm) {
        setFormData({
          ...formData,
          showMebCh33SelfForm,
        });
      }

      if (email && email !== formData?.email?.email) {
        setFormData({
          ...formData,
          email: {
            ...formData?.email,
            email,
          },
        });
      }

      if (mobilePhone !== formData?.mobilePhone) {
        setFormData({
          ...formData,
          mobilePhone,
        });
      }

      if (formData?.duplicateEmail === undefined && formData?.email?.email) {
        setFormData({
          ...formData,
          duplicateEmail: [{ value: formData?.email?.email, dupe: '' }],
        });
      }

      if (formData?.duplicatePhone === undefined && formData?.mobilePhone) {
        setFormData({
          ...formData,
          duplicatePhone: [{ value: formData?.mobilePhone, dupe: '' }],
        });
      }

      if (formData?.duplicatePhone && formData?.duplicateEmail) {
        getDuplicateContactInfo(
          formData?.duplicatePhone,
          formData?.duplicateEmail,
        );
      }

      if (showMebEnhancements !== formData.showMebEnhancements) {
        setFormData({
          ...formData,
          showMebEnhancements,
        });
      }
      if (showMebEnhancements06 !== formData.showMebEnhancements06) {
        setFormData({
          ...formData,
          showMebEnhancements06,
        });
      }
      if (isLOA3 !== formData.isLOA3) {
        setFormData({
          ...formData,
          isLOA3, // ES6 Syntax
        });
      }
    },
    [
      formData,
      isLOA3,
      setFormData,
      showMebDgi40Features,
      showMebDgi42Features,
      showMebCh33SelfForm,
      showMebEnhancements,
      showMebEnhancements06,
      email,
      getDuplicateContactInfo,
    ],
  );

  // Commenting out until Direct Deposit component is updated
  // useEffect(
  //   () => {
  //     if (showMebDgi40Features && isLoggedIn && !fetchedDirectDeposit) {
  //       setFetchedDirectDeposit(true);
  //       getDirectDeposit();
  //     }
  //   },
  //   [fetchedDirectDeposit, getDirectDeposit, isLoggedIn, showMebDgi40Features],
  // );

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
  // getDirectDeposit: PropTypes.func,
  getEligibility: PropTypes.func,
  getPersonalInfo: PropTypes.func,
  isLOA3: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  location: PropTypes.object,
  setFormData: PropTypes.func,
  showMebDgi40Features: PropTypes.bool,
  showMebCh33SelfForm: PropTypes.bool,
  email: PropTypes.string,
  mobilePhone: PropTypes.string,
  showMebEnhancements: PropTypes.bool,
  showMebEnhancements06: PropTypes.bool,
  duplicateEmail: PropTypes.array,
  duplicatePhone: PropTypes.array,
};

const mapStateToProps = state => {
  const formData = state.form?.data || {};
  const firstName = state.data?.formData?.data?.attributes?.claimant?.firstName;
  const transformedClaimantInfo = prefillTransformer(null, null, null, state);
  const claimantInfo = transformedClaimantInfo.formData;
  const email = state?.data?.email;
  const mobilePhone =
    state?.data?.formData?.data?.attributes?.claimant?.contactInfo
      ?.mobilePhoneNumber;

  return {
    ...getAppData(state),
    formData,
    firstName,
    claimantInfo,
    email,
    mobilePhone,
  };
};

const mapDispatchToProps = {
  // getDirectDeposit: fetchDirectDeposit,
  getEligibility: fetchEligibility,
  setFormData: setData,
  getPersonalInfo: fetchPersonalInformation,
  getDuplicateContactInfo: fetchDuplicateContactInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
