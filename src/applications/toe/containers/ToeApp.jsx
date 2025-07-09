import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { isArray } from 'lodash';
import PropTypes from 'prop-types';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { setData } from 'platform/forms-system/src/js/actions';
import formConfig from '../config/form';

import {
  fetchPersonalInformation,
  fetchDirectDeposit,
  fetchDuplicateContactInfo,
} from '../actions';
import { mapFormSponsors, prefillTransformer } from '../helpers';
import { SPONSORS_TYPE } from '../constants';
import { getAppData } from '../selectors';

function ToeApp({
  children,
  dob,
  duplicateEmail,
  duplicatePhone,
  formData,
  getDirectDeposit,
  getDuplicateContactInfo,
  getPersonalInformation,
  isLOA3,
  isLoggedIn,
  location,
  mebDpoAddressOptionEnabled,
  setFormData,
  sponsors,
  sponsorsInitial,
  sponsorsSavedState,
  user,
  showMeb1990ER6MaintenanceMessage,
  toeHighSchoolInfoChange,
  toeLightHouseDgiDirectDeposit,
}) {
  const [fetchedUserInfo, setFetchedUserInfo] = useState(false);
  const [fetchedDirectDeposit, setFetchedDirectDeposit] = useState(false);
  const [lightHouseFlag, setLighthouseFlag] = useState(false);

  useEffect(
    () => {
      if (!user?.login?.currentlyLoggedIn) {
        return;
      }
      if (!fetchedUserInfo) {
        setFetchedUserInfo(true);
        getPersonalInformation();
      }

      if (
        !sponsors?.loadedFromSavedState &&
        isArray(sponsorsSavedState?.sponsors)
      ) {
        setFormData(mapFormSponsors(formData, sponsorsSavedState));
      } else if (sponsorsInitial && !sponsors) {
        setFormData(mapFormSponsors(formData, sponsorsInitial));
      }
    },
    [
      fetchedUserInfo,
      formData,
      getPersonalInformation,
      user?.login?.currentlyLoggedIn,
      setFormData,
      sponsors,
      sponsorsInitial,
      sponsorsSavedState,
    ],
  );

  useEffect(
    () => {
      if (isLOA3 !== formData.isLOA3) {
        setFormData({
          ...formData,
          isLOA3,
        });
      }
    },
    [formData, setFormData, isLOA3],
  );

  useEffect(
    () => {
      if (
        showMeb1990ER6MaintenanceMessage !==
        formData.showMeb1990ER6MaintenanceMessage
      ) {
        setFormData({
          ...formData,
          showMeb1990ER6MaintenanceMessage,
        });
      }
    },
    [formData, setFormData, showMeb1990ER6MaintenanceMessage],
  );

  useEffect(
    () => {
      if (
        formData['view:phoneNumbers']?.mobilePhoneNumber?.phone &&
        formData?.email?.email &&
        !formData?.duplicateEmail &&
        !formData?.duplicatePhone
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
    },
    [
      formData,
      setFormData,
      duplicateEmail,
      duplicatePhone,
      getDuplicateContactInfo,
    ],
  );

  useEffect(
    () => {
      if (
        toeLightHouseDgiDirectDeposit !==
        formData?.toeLightHouseDgiDirectDeposit
      ) {
        setLighthouseFlag(true);
        setFormData({
          ...formData,
          toeLightHouseDgiDirectDeposit,
        });
      }
    },
    [formData, setFormData, toeLightHouseDgiDirectDeposit],
  );

  useEffect(
    () => {
      if (!user?.login?.currentlyLoggedIn) {
        return;
      }

      if (!fetchedDirectDeposit && lightHouseFlag && isLoggedIn && isLOA3) {
        setFetchedDirectDeposit(true);
        getDirectDeposit(formData?.toeLightHouseDgiDirectDeposit);
      }
    },
    [
      isLoggedIn,
      isLOA3,
      fetchedDirectDeposit,
      getDirectDeposit,
      user?.login?.currentlyLoggedIn,
      lightHouseFlag,
      formData?.toeLightHouseDgiDirectDeposit,
    ],
  );

  useEffect(
    () => {
      if (toeHighSchoolInfoChange !== formData.toeHighSchoolInfoChange) {
        setFormData({
          ...formData,
          toeHighSchoolInfoChange,
        });
      }
    },
    [formData, setFormData, toeHighSchoolInfoChange],
  );

  useEffect(
    () => {
      if (mebDpoAddressOptionEnabled !== formData.mebDpoAddressOptionEnabled) {
        setFormData({
          ...formData,
          mebDpoAddressOptionEnabled,
        });
      }
    },
    [formData, setFormData, mebDpoAddressOptionEnabled],
  );

  useEffect(
    () => {
      if (dob !== formData?.dob) {
        setFormData({
          ...formData,
          dob,
        });
      }
    },
    [dob, formData, setFormData],
  );
  return (
    <>
      <div className="row">
        <div className="vads-u-margin-bottom--4">
          <VaBreadcrumbs
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
                href:
                  '/education/survivor-dependent-benefits/transferred-benefits/',
                label: 'VA education benefits for survivors and dependents',
              },
              {
                href:
                  '/family-and-caregiver-benefits/education-and-careers/transferred-gi-bill-benefits/apply-form-22-1990e',
                label: 'Apply to use transferred education benefits',
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
}

ToeApp.propTypes = {
  children: PropTypes.object,
  dob: PropTypes.string,
  duplicateEmail: PropTypes.array,
  duplicatePhone: PropTypes.array,
  formData: PropTypes.object,
  getDirectDeposit: PropTypes.func,
  getDuplicateContactInfo: PropTypes.func,
  getPersonalInformation: PropTypes.func,
  isLOA3: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  location: PropTypes.object,
  mebDpoAddressOptionEnabled: PropTypes.bool,
  setFormData: PropTypes.func,
  showMeb1990ER6MaintenanceMessage: PropTypes.bool,
  showUpdatedFryDeaApp: PropTypes.bool,
  sponsors: SPONSORS_TYPE,
  sponsorsInitial: SPONSORS_TYPE,
  sponsorsSavedState: SPONSORS_TYPE,
  toeHighSchoolInfoChange: PropTypes.bool,
  toeLightHouseDgiDirectDeposit: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => {
  const prefillData =
    prefillTransformer(null, null, null, state)?.formData || {};
  const formStateData = state.form?.data || {};
  const directDepositData = state.data?.directDeposit || {};
  const contactInfoData = state.data?.contactInfo || {};

  // Create merged form data with proper precedence
  const mergedFormData = {
    ...prefillData,
    ...formStateData,
    'view:directDeposit': {
      ...(prefillData['view:directDeposit'] || {}),
      ...(formStateData['view:directDeposit'] || {}),
      ...(directDepositData || {}),
    },
    'view:phoneNumbers': {
      ...(prefillData['view:phoneNumbers'] || {}),
      ...(formStateData['view:phoneNumbers'] || {}),
      ...(contactInfoData?.phoneNumbers || {}),
    },
    email: formStateData.email || prefillData.email || contactInfoData?.email,
    mobilePhone:
      formStateData.mobilePhone ||
      prefillData.mobilePhone ||
      contactInfoData?.mobilePhone,
    homePhone:
      formStateData.homePhone ||
      prefillData.homePhone ||
      contactInfoData?.homePhone,
    duplicateEmail: formStateData.duplicateEmail || state.data?.duplicateEmail,
    duplicatePhone: formStateData.duplicatePhone || state.data?.duplicatePhone,
    sponsors: formStateData.sponsors || prefillData.sponsors,
    toeLightHouseDgiDirectDeposit:
      formStateData.toeLightHouseDgiDirectDeposit ||
      state.featureToggles?.toeLightHouseDgiDirectDeposit,
  };

  return {
    ...getAppData(state),
    claimant: state?.data?.formData?.data?.attributes?.claimant,
    dob:
      state?.user?.profile?.dob ||
      state?.data?.formData?.data?.attributes?.claimant?.dateOfBirth,
    formData: mergedFormData,
    fetchedSponsorsComplete: state.data?.fetchedSponsorsComplete,
    sponsors: state.form?.data?.sponsors,
    sponsorsInitial: state?.data?.sponsors,
    sponsorsSavedState: state.form?.loadedData?.formData?.sponsors,
    user: state.user,
  };
};

const mapDispatchToProps = {
  getDirectDeposit: fetchDirectDeposit,
  getPersonalInformation: fetchPersonalInformation,
  setFormData: setData,
  getDuplicateContactInfo: fetchDuplicateContactInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToeApp);
