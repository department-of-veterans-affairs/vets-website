import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { setData } from 'platform/forms-system/src/js/actions';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

import {
  fetchDuplicateContactInfo,
  fetchPersonalInformation,
} from '../actions';
import { prefillTransformer } from '../helpers';
import formConfig from '../config/form';
import { getAppData } from '../selectors';

function App({
  children,
  claimant,
  duplicateEmail,
  duplicatePhone,
  dob,
  formData,
  getDuplicateContactInfo,
  getPersonalInformation,
  location,
  mebDpoAddressOptionEnabled,
  setFormData,
  user,
}) {
  const [fetchedUserInfo, setFetchedUserInfo] = useState(false);

  useEffect(
    () => {
      if (!user?.login?.currentlyLoggedIn) {
        return;
      }
      if (!fetchedUserInfo) {
        setFetchedUserInfo(true);
        getPersonalInformation();
      }

      // if (
      //   !sponsors?.loadedFromSavedState &&
      //   isArray(sponsorsSavedState?.sponsors)
      // ) {
      //   setFormData(mapFormSponsors(formData, sponsorsSavedState));
      // } else if (sponsorsInitial && !sponsors) {
      //   setFormData(mapFormSponsors(formData, sponsorsInitial));
      // }
    },
    [
      fetchedUserInfo,
      formData,
      getPersonalInformation,
      user?.login?.currentlyLoggedIn,
      setFormData,
    ],
  );

  useEffect(
    () => {
      if (user?.profile) {
        setFormData({
          ...formData,
          claimantFullName: {
            first: user.profile.userFullName.first,
            middle: user.profile.userFullName.middle,
            last: user.profile.userFullName.last,
            suffix: user.profile.userFullName.suffix,
          },
          claimantDateOfBirth: user.profile.dob,
        });
      }
    },
    [user?.profile],
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
    [mebDpoAddressOptionEnabled, formData, setFormData],
  );

  useEffect(
    () => {
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

      if (
        (formData?.mobilePhone?.phone || formData?.email) &&
        !formData?.duplicateEmail &&
        !formData?.duplicatePhone
      ) {
        getDuplicateContactInfo(
          [{ value: formData?.email?.email, dupe: '' }],
          [
            {
              value: formData?.mobilePhone?.phone,
              dupe: '',
            },
          ],
        );
      }
    },
    [getDuplicateContactInfo, formData],
  );

  // Keep claimantDateOfBirth in sync with profile/pre-fill data
  useEffect(
    () => {
      if (dob && dob !== formData?.claimantDateOfBirth) {
        setFormData({
          ...formData,
          claimantDateOfBirth: dob,
        });
      }
    },
    [dob, formData, setFormData],
  );

  // Fallback to prefillTransformer data if claimant info still missing
  useEffect(
    () => {
      if (
        claimant &&
        Object.keys(claimant).length > 0 &&
        (!formData?.claimantFullName?.first || !formData?.claimantDateOfBirth)
      ) {
        setFormData({
          ...formData,
          claimantFullName:
            claimant.claimantFullName || formData.claimantFullName,
          claimantDateOfBirth:
            claimant.claimantDateOfBirth || formData.claimantDateOfBirth,
        });
      }
    },
    [claimant, formData, setFormData],
  );

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
                href: '/family-and-caregiver-benefits',
                label: 'VA benefits for family and caregivers',
              },
              {
                href: '/family-and-caregiver-benefits/education-and-careers',
                label: 'Education and career benefits for family members',
              },
              {
                href:
                  '/family-and-caregiver-benefits/education-and-careers/apply-for-dea-fry-form-22-5490',
                label: 'Apply for education benefits as an eligible dependent',
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

App.propTypes = {
  children: PropTypes.node,
  claimant: PropTypes.object,
  duplicateEmail: PropTypes.array,
  duplicatePhone: PropTypes.array,
  dob: PropTypes.string,
  formData: PropTypes.object,
  getDuplicateContactInfo: PropTypes.func,
  getPersonalInformation: PropTypes.func,
  location: PropTypes.object,
  mebDpoAddressOptionEnabled: PropTypes.bool,
  setFormData: PropTypes.func,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  ...getAppData(state),
  formData: state.form?.data || {},
  claimant: prefillTransformer(null, null, null, state)?.formData,
  dob:
    state?.user?.profile?.dob ||
    state?.data?.formData?.data?.attributes?.claimant?.dateOfBirth,
  user: state.user,
});

const mapDispatchToProps = {
  getPersonalInformation: fetchPersonalInformation,
  getDuplicateContactInfo: fetchDuplicateContactInfo,
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
