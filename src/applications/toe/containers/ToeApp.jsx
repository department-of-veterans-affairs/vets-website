import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { isArray } from 'lodash';
import merge from 'lodash/merge';
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
  meb1995Reroute,
  mebDpoAddressOptionEnabled,
  mebBankInfoConfirmationField,
  setFormData,
  sponsors,
  sponsorsInitial,
  sponsorsSavedState,
  user,
  showMeb1990ER6MaintenanceMessage,
  toeHighSchoolInfoChange,
}) {
  const [fetchedUserInfo, setFetchedUserInfo] = useState(false);
  const [fetchedDirectDeposit, setFetchedDirectDeposit] = useState(false);

  useEffect(
    () => {
      if (
        mebBankInfoConfirmationField !== formData.mebBankInfoConfirmationField
      ) {
        setFormData({
          ...formData,
          mebBankInfoConfirmationField,
        });
      }
    },
    [mebBankInfoConfirmationField, formData, setFormData],
  );

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
      } else if (
        sponsorsInitial &&
        !sponsors &&
        isArray(sponsorsInitial?.sponsors)
      ) {
        setFormData(mapFormSponsors(formData, sponsorsInitial));
      }
    },
    [
      fetchedUserInfo,
      getPersonalInformation,
      user?.login?.currentlyLoggedIn,
      setFormData,
      sponsors,
      sponsorsInitial,
      sponsorsSavedState,
      formData.sponsors,
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
    [isLOA3],
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
    [showMeb1990ER6MaintenanceMessage],
  );

  useEffect(
    () => {
      if (meb1995Reroute !== formData.meb1995Reroute) {
        setFormData({
          ...formData,
          meb1995Reroute,
        });
      }
    },
    [formData, meb1995Reroute, setFormData],
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
    [getDuplicateContactInfo, duplicateEmail, duplicatePhone],
  );

  useEffect(
    () => {
      if (!user?.login?.currentlyLoggedIn) {
        return;
      }

      if (!fetchedDirectDeposit && isLoggedIn && isLOA3) {
        setFetchedDirectDeposit(true);
        getDirectDeposit();
      }
    },
    [
      isLoggedIn,
      isLOA3,
      fetchedDirectDeposit,
      getDirectDeposit,
      user?.login?.currentlyLoggedIn,
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
    [toeHighSchoolInfoChange],
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
    [mebDpoAddressOptionEnabled],
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
    [dob, setFormData],
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
  meb1995Reroute: PropTypes.bool,
  mebBankInfoConfirmationField: PropTypes.bool,
  mebDpoAddressOptionEnabled: PropTypes.bool,
  setFormData: PropTypes.func,
  showMeb1990ER6MaintenanceMessage: PropTypes.bool,
  showUpdatedFryDeaApp: PropTypes.bool,
  sponsors: SPONSORS_TYPE,
  sponsorsInitial: SPONSORS_TYPE,
  sponsorsSavedState: SPONSORS_TYPE,
  toeHighSchoolInfoChange: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => {
  const prefillData =
    prefillTransformer(null, null, null, state)?.formData || {};
  const formStateData = state.form?.data || {};

  // Deeply merge form state over prefill data
  const formData = merge({}, prefillData, formStateData);

  return {
    ...getAppData(state),
    claimant: state?.data?.formData?.data?.attributes?.claimant,
    dob:
      state?.user?.profile?.dob ||
      state?.data?.formData?.data?.attributes?.claimant?.dateOfBirth,
    formData,
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
