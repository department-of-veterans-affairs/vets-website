import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { setData } from 'platform/forms-system/src/js/actions';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

import formConfig from '../config/form';
import {
  fetchPersonalInformation,
  fetchExclusionPeriods,
  fetchDuplicateContactInfo,
  fetchDirectDeposit,
} from '../actions';
import { formFields } from '../constants';
import { prefillTransformer } from '../helpers';
import { getAppData } from '../selectors/selectors';
import { duplicateArrays } from '../utils/validation';

export const App = ({
  children,
  claimantInfo,
  eligibleForActiveDutyKicker,
  eligibleForReserveKicker,
  exclusionPeriods,
  featureTogglesLoaded,
  firstName,
  formData,
  getDirectDeposit,
  getExclusionPeriods,
  getPersonalInfo,
  getDuplicateContactInfo,
  isLOA3,
  isLoggedIn,
  location,
  mebDpoAddressOptionEnabled,
  setFormData,
  showMeb1990EZMaintenanceAlert,
  showMeb1990EZR6MaintenanceMessage,
  showMebEnhancements06,
  showMebEnhancements08,
  showMebEnhancements09,
  mebKickerNotificationEnabled,
  mebBankInfoConfirmationField,
  email,
  duplicateEmail,
  duplicatePhone,
  meb160630Automation,
  meb1995Reroute,
}) => {
  const [fetchedContactInfo, setFetchedContactInfo] = useState(false);
  const [fetchedDirectDeposit, setFetchedDirectDeposit] = useState(false);
  const [fetchedExclusionPeriods, setFetchedExclusionPeriods] = useState(false);
  const [fetchedPersonalInfo, setFetchedPersonalInfo] = useState(false);
  const previousChosenBenefit = useRef();

  // Prevent some browsers from changing the value when scrolling while hovering
  //  over an input[type="number"] with focus.
  useEffect(() => {
    const handleWheel = event => {
      if (
        event.target.type === 'number' &&
        document.activeElement === event.target
      ) {
        event.preventDefault();
        document.body.scrollTop += event.deltaY; // Chrome, Safari, etc.
        document.documentElement.scrollTop += event.deltaY; // Firefox, IE, etc.
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });

    // Cleanup on unmount
    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !featureTogglesLoaded || isLOA3 !== true) {
      return;
    }

    // Only fetch personal and contact info once a benefit is chosen
    if (formData?.chosenBenefit) {
      // Fetch personal and contact info if not already fetched, or if the benefit has changed
      if (
        !fetchedPersonalInfo ||
        !fetchedContactInfo ||
        formData?.chosenBenefit !== previousChosenBenefit.current
      ) {
        setFetchedPersonalInfo(true);
        setFetchedContactInfo(true);
        getPersonalInfo(formData?.chosenBenefit); // Fetch based on chosen benefit

        // Update previousChosenBenefit to the current chosenBenefit
        previousChosenBenefit.current = formData?.chosenBenefit;
      }

      // If claimantId is missing in formData, update it with claimantInfo
      if (!formData[formFields.claimantId] && claimantInfo?.claimantId) {
        setFormData({
          ...formData,
          ...claimantInfo,
        });
      }
    }
    // If claimantId is missing and claimantInfo is available, update formData
    else if (!formData[formFields.claimantId] && claimantInfo?.claimantId) {
      setFormData({
        ...formData,
        ...claimantInfo,
      });
    }
  }, [
    claimantInfo,
    featureTogglesLoaded,
    fetchedContactInfo,
    fetchedPersonalInfo,
    formData,
    getPersonalInfo,
    isLOA3,
    isLoggedIn,
    setFormData,
    formData?.chosenBenefit,
  ]);

  useEffect(() => {
    if (!isLoggedIn || !featureTogglesLoaded || isLOA3 !== true) {
      return;
    }

    const { toursOfDuty } = formData;
    const updatedToursOfDuty = toursOfDuty?.map(tour => {
      const tourToCheck = tour;
      if (
        (tourToCheck?.dateRange?.to && new Date(tourToCheck?.dateRange?.to)) >
          new Date() ||
        tourToCheck?.dateRange?.to === '' ||
        tourToCheck?.dateRange?.to === null ||
        tourToCheck.dateRange.to === 'Invalid date'
      ) {
        tourToCheck.serviceCharacter = 'Not Applicable';
        tourToCheck.separationReason = 'Not Applicable';
      }
      return tourToCheck;
    });

    if (!duplicateArrays(updatedToursOfDuty, toursOfDuty)) {
      setFormData({
        ...formData,
        toursOfDuty: updatedToursOfDuty,
      });
    }
  }, [
    featureTogglesLoaded,
    firstName,
    formData,
    isLOA3,
    isLoggedIn,
    setFormData,
  ]);

  useEffect(() => {
    if (!isLoggedIn || !featureTogglesLoaded || isLOA3 !== true) {
      return;
    }

    // Update eligibleForActiveDutyKicker in formData
    if (eligibleForActiveDutyKicker !== formData.eligibleForActiveDutyKicker) {
      setFormData({
        ...formData,
        eligibleForActiveDutyKicker,
      });
    }

    // Update eligibleForReserveKicker in formData
    if (eligibleForReserveKicker !== formData.eligibleForReserveKicker) {
      setFormData({
        ...formData,
        eligibleForReserveKicker,
      });
    }
  }, [
    eligibleForActiveDutyKicker,
    eligibleForReserveKicker,
    formData,
    isLoggedIn,
    featureTogglesLoaded,
    isLOA3,
    setFormData,
  ]);

  useEffect(() => {
    if (!isLoggedIn || !featureTogglesLoaded || isLOA3 !== true) {
      return;
    }

    // Skip fetching exclusion periods if mebKickerNotificationEnabled is true
    if (mebKickerNotificationEnabled) {
      return;
    }

    // The firstName check ensures that exclusion periods only get called after we have obtained claimant info
    // We need this to avoid a race condition when a user is being loaded freshly from VADIR on DGIB
    if (firstName && !fetchedExclusionPeriods && formData?.chosenBenefit) {
      const chosenBenefit = formData?.chosenBenefit || 'Chapter33';

      setFetchedExclusionPeriods(true);
      getExclusionPeriods(chosenBenefit);
    }

    if (
      firstName &&
      !fetchedExclusionPeriods &&
      formData?.chosenBenefit &&
      formData?.chosenBenefit !== previousChosenBenefit.current
    ) {
      const chosenBenefit = formData?.chosenBenefit || 'Chapter33';

      previousChosenBenefit.current = formData?.chosenBenefit;
      setFetchedExclusionPeriods(true);
      getExclusionPeriods(chosenBenefit);
    }

    if (exclusionPeriods && !formData.exclusionPeriods) {
      const updatedFormData = {
        ...formData,
        exclusionPeriods, // Update form data with fetched exclusion periods
      };
      setFormData(updatedFormData);
    }
  }, [
    fetchedExclusionPeriods,
    firstName,
    getExclusionPeriods,
    exclusionPeriods,
    formData,
    setFormData,
    isLoggedIn,
    featureTogglesLoaded,
    isLOA3,
    mebKickerNotificationEnabled,
  ]);

  useEffect(() => {
    if (mebDpoAddressOptionEnabled !== formData.mebDpoAddressOptionEnabled) {
      setFormData({
        ...formData,
        mebDpoAddressOptionEnabled,
      });
    }
    if (
      mebKickerNotificationEnabled !== formData.mebKickerNotificationEnabled
    ) {
      setFormData({
        ...formData,
        mebKickerNotificationEnabled,
      });
    }

    if (
      showMeb1990EZMaintenanceAlert !== formData.showMeb1990EZMaintenanceAlert
    ) {
      setFormData({
        ...formData,
        showMeb1990EZMaintenanceAlert,
      });
    }
    if (
      showMeb1990EZR6MaintenanceMessage !==
      formData.showMeb1990EZR6MaintenanceMessage
    ) {
      setFormData({
        ...formData,
        showMeb1990EZR6MaintenanceMessage,
      });
    }

    if (
      formData['view:phoneNumbers']?.mobilePhoneNumber?.phone &&
      formData?.email?.email &&
      !formData?.duplicateEmail &&
      !formData?.duplicatePhone &&
      formData?.showMebEnhancements08
    ) {
      getDuplicateContactInfo(
        [{ value: formData?.email?.email, dupe: '' }],
        [
          {
            value: formData['view:phoneNumbers']?.mobilePhoneNumber?.phone,
            dupe: '',
          },
        ],
      );
    }

    if (
      duplicateEmail?.length > 0 &&
      duplicateEmail !== formData?.duplicateEmail
    ) {
      setFormData({
        ...formData,
        duplicateEmail,
      });
    }

    if (
      duplicatePhone?.length > 0 &&
      duplicatePhone !== formData?.duplicatePhone
    ) {
      setFormData({
        ...formData,
        duplicatePhone,
      });
    }

    if (showMebEnhancements06 !== formData.showMebEnhancements06) {
      setFormData({
        ...formData,
        showMebEnhancements06,
      });
    }

    if (showMebEnhancements08 !== formData.showMebEnhancements08) {
      setFormData({
        ...formData,
        showMebEnhancements08,
      });
    }

    if (meb160630Automation !== formData?.meb160630Automation) {
      setFormData({
        ...formData,
        meb160630Automation,
      });
    }

    if (meb1995Reroute !== formData?.meb1995Reroute) {
      setFormData({
        ...formData,
        meb1995Reroute,
      });
    }

    if (showMebEnhancements09 !== formData.showMebEnhancements09) {
      setFormData({
        ...formData,
        showMebEnhancements09,
      });
    }

    if (
      mebBankInfoConfirmationField !== formData.mebBankInfoConfirmationField
    ) {
      setFormData({
        ...formData,
        mebBankInfoConfirmationField,
      });
    }

    if (isLOA3 !== formData.isLOA3) {
      setFormData({
        ...formData,
        isLOA3,
      });
    }
  }, [
    formData,
    isLOA3,
    setFormData,
    showMeb1990EZMaintenanceAlert,
    showMeb1990EZR6MaintenanceMessage,
    showMebEnhancements06,
    showMebEnhancements08,
    showMebEnhancements09,
    getDuplicateContactInfo,
    duplicateEmail,
    duplicatePhone,
    meb160630Automation,
    meb1995Reroute,
    mebDpoAddressOptionEnabled,
    mebKickerNotificationEnabled,
    mebBankInfoConfirmationField,
  ]);

  useEffect(() => {
    if (email && email !== formData?.email?.email) {
      setFormData({
        ...formData,
        email: {
          ...formData?.email,
          email,
        },
      });
    }
  }, [email, formData, setFormData]);

  useEffect(() => {
    const fetchAndUpdateDirectDepositInfo = async () => {
      if (isLoggedIn && isLOA3 && !fetchedDirectDeposit) {
        await getDirectDeposit();
        setFetchedDirectDeposit(true);
      }
    };
    fetchAndUpdateDirectDepositInfo();
  }, [
    isLoggedIn,
    isLOA3,
    fetchedDirectDeposit,
    getDirectDeposit,
    setFetchedDirectDeposit,
  ]);

  return (
    <>
      <div className="row">
        <div className="vads-u-margin-bottom--4">
          <VaBreadcrumbs
            label="Breadcrumbs"
            wrapping
            breadcrumbList={[
              {
                href: '/',
                label: 'Home',
              },
              {
                href: '/education',
                label: 'Education and training',
              },
              {
                href: '/education/apply-for-gi-bill-form-22-1990',
                label: 'Apply for VA education benefits Form 22-1990',
              },
            ]}
          />
        </div>
      </div>

      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </>
  );
};

App.propTypes = {
  children: PropTypes.object,
  claimantInfo: PropTypes.object,
  duplicateEmail: PropTypes.array,
  duplicatePhone: PropTypes.array,
  eligibleForActiveDutyKicker: PropTypes.bool,
  eligibleForReserveKicker: PropTypes.bool,
  email: PropTypes.string,
  exclusionPeriods: PropTypes.arrayOf(PropTypes.string),
  featureTogglesLoaded: PropTypes.bool,
  firstName: PropTypes.string,
  formData: PropTypes.object,
  getDirectDeposit: PropTypes.func,
  getDuplicateContactInfo: PropTypes.func,
  getExclusionPeriods: PropTypes.func,
  getPersonalInfo: PropTypes.func,
  isLOA3: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  location: PropTypes.object,
  meb160630Automation: PropTypes.bool,
  meb1995Reroute: PropTypes.bool,
  mebBankInfoConfirmationField: PropTypes.bool,
  mebDpoAddressOptionEnabled: PropTypes.bool,
  mebKickerNotificationEnabled: PropTypes.bool,
  mobilePhone: PropTypes.string,
  setFormData: PropTypes.func,
  showMeb1990EZMaintenanceAlert: PropTypes.bool,
  showMeb1990EZR6MaintenanceMessage: PropTypes.bool,
  showMebEnhancements06: PropTypes.bool,
  showMebEnhancements08: PropTypes.bool,
  showMebEnhancements09: PropTypes.bool,
};

const mapStateToProps = state => {
  const formData = state.form?.data || {};
  const firstName = state.data?.formData?.data?.attributes?.claimant?.firstName;
  const transformedClaimantInfo = prefillTransformer(null, null, null, state);
  const claimantInfo = transformedClaimantInfo.formData;
  const email = state?.form?.data?.email?.email;
  const exclusionPeriods = state?.data?.exclusionPeriods;

  return {
    ...getAppData(state),
    formData,
    firstName,
    claimantInfo,
    email,
    exclusionPeriods,
  };
};

const mapDispatchToProps = {
  getDirectDeposit: fetchDirectDeposit,
  getExclusionPeriods: fetchExclusionPeriods,
  setFormData: setData,
  getPersonalInfo: fetchPersonalInformation,
  getDuplicateContactInfo: fetchDuplicateContactInfo,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
