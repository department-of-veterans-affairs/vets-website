import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { setData } from 'platform/forms-system/src/js/actions';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

import formConfig from '../config/form';
import {
  fetchPersonalInformation,
  fetchEligibility,
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
  isLOA3,
  isLoggedIn,
  location,
  setFormData,
  showMebDgi40Features,
  showMebCh33SelfForm,
}) => {
  const [fetchedPersonalInfo, setFetchedPersonalInfo] = useState(false);
  const [fetchedEligibility, setFetchedEligibility] = useState(false);
  // Commenting out next line until component can handle astrisks (See TOE app)
  // const [fetchedDirectDeposit, setFetchedDirectDeposit] = useState(false);

  useEffect(
    () => {
      if (!isLoggedIn || !featureTogglesLoaded || isLOA3 !== true) {
        return;
      }

      if (!fetchedPersonalInfo) {
        setFetchedPersonalInfo(true);
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
    },
    [formData, setFormData, showMebDgi40Features],
  );

  useEffect(
    () => {
      if (showMebCh33SelfForm !== formData.showMebCh33SelfForm) {
        setFormData({
          ...formData,
          showMebCh33SelfForm,
        });
      }
    },
    [formData, setFormData, showMebCh33SelfForm],
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
  // getDirectDeposit: fetchDirectDeposit,
  getEligibility: fetchEligibility,
  setFormData: setData,
  getPersonalInfo: fetchPersonalInformation,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
