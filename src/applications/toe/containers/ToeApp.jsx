import React, { useEffect, useRef, useState } from 'react';
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
  mebBankInfoConfirmationField,
  setFormData,
  sponsors,
  sponsorsInitial,
  sponsorsSavedState,
  user,
}) {
  const [fetchedUserInfo, setFetchedUserInfo] = useState(false);
  const [fetchedDirectDeposit, setFetchedDirectDeposit] = useState(false);
  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  // Sync props into formData in a single effect to avoid race conditions
  // where multiple effects spread stale formData and overwrite each other.
  useEffect(
    () => {
      const updates = {};

      if (
        mebBankInfoConfirmationField !== formData.mebBankInfoConfirmationField
      )
        updates.mebBankInfoConfirmationField = mebBankInfoConfirmationField;
      if (isLOA3 !== formData.isLOA3) updates.isLOA3 = isLOA3;
      if (dob !== formData?.dob) updates.dob = dob;
      if (
        duplicateEmail?.length > 0 &&
        duplicateEmail !== formData?.duplicateEmail
      )
        updates.duplicateEmail = duplicateEmail;
      if (
        duplicatePhone?.length > 0 &&
        duplicatePhone !== formData?.duplicatePhone
      )
        updates.duplicatePhone = duplicatePhone;

      if (Object.keys(updates).length > 0) {
        setFormData({
          ...formData,
          ...updates,
        });
      }
    },
    [
      mebBankInfoConfirmationField,
      isLOA3,
      dob,
      duplicateEmail,
      duplicatePhone,
      formData,
      setFormData,
    ],
  );

  // Fetch personal information (one-time on login)
  useEffect(
    () => {
      if (!user?.login?.currentlyLoggedIn) {
        return;
      }
      if (!fetchedUserInfo) {
        setFetchedUserInfo(true);
        getPersonalInformation();
      }
    },
    [fetchedUserInfo, getPersonalInformation, user?.login?.currentlyLoggedIn],
  );

  // Sync sponsors from saved state or initial fetch into formData.
  // Uses formDataRef to read the latest formData without including it
  // as a dependency — this prevents re-running on every keystroke.
  useEffect(
    () => {
      if (!user?.login?.currentlyLoggedIn) {
        return;
      }

      if (
        !sponsors?.loadedFromSavedState &&
        isArray(sponsorsSavedState?.sponsors)
      ) {
        setFormData(mapFormSponsors(formDataRef.current, sponsorsSavedState));
      } else if (
        sponsorsInitial &&
        !sponsors &&
        isArray(sponsorsInitial?.sponsors)
      ) {
        setFormData(mapFormSponsors(formDataRef.current, sponsorsInitial));
      }
    },
    [
      user?.login?.currentlyLoggedIn,
      sponsors,
      sponsorsInitial,
      sponsorsSavedState,
      setFormData,
      formDataRef,
    ],
  );

  // Extract nested formData values so the dependency array stays simple
  // and ESLint can statically verify exhaustive-deps.
  const mobilePhone = formData?.['view:phoneNumbers']?.mobilePhoneNumber?.phone;
  const emailAddress = formData?.email?.email;
  const formDuplicateEmail = formData?.duplicateEmail;
  const formDuplicatePhone = formData?.duplicatePhone;

  // Check for duplicate contact info when phone/email are available
  useEffect(
    () => {
      if (
        mobilePhone &&
        emailAddress &&
        !formDuplicateEmail &&
        !formDuplicatePhone
      ) {
        getDuplicateContactInfo(
          [{ value: emailAddress, dupe: '' }],
          [{ value: mobilePhone, dupe: '' }],
        );
      }
    },
    [
      getDuplicateContactInfo,
      mobilePhone,
      emailAddress,
      formDuplicateEmail,
      formDuplicatePhone,
    ],
  );

  // Fetch direct deposit info (one-time after LOA3 confirmed)
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
  mebBankInfoConfirmationField: PropTypes.bool,
  mebDpoAddressOptionEnabled: PropTypes.bool,
  setFormData: PropTypes.func,
  showUpdatedFryDeaApp: PropTypes.bool,
  sponsors: SPONSORS_TYPE,
  sponsorsInitial: SPONSORS_TYPE,
  sponsorsSavedState: SPONSORS_TYPE,
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
