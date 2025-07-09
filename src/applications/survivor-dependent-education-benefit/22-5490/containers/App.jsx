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
import formConfig from '../config/form';
import { getAppData } from '../selectors';
import { prefillTransformer } from '../helpers';

function App({
  children,
  duplicateEmail,
  duplicatePhone,
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

  // useEffect(
  //   () => {
  //     if (
  //       user?.profile &&
  //       (!formData?.claimantFullName?.first ||
  //         !formData?.claimantFullName?.last ||
  //         !formData?.claimantDateOfBirth)
  //     ) {
  //       setFormData({
  //         ...formData,
  //         claimantFullName: {
  //           first: user.profile.userFullName.first,
  //           middle: user.profile.userFullName.middle,
  //           last: user.profile.userFullName.last,
  //           suffix: user.profile.userFullName.suffix,
  //         },
  //         claimantDateOfBirth: user.profile.dob,
  //       });
  //     }
  //   },
  //   [user?.profile, setFormData],
  // );

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
  duplicateEmail: PropTypes.array,
  duplicatePhone: PropTypes.array,
  formData: PropTypes.object,
  getDuplicateContactInfo: PropTypes.func,
  getPersonalInformation: PropTypes.func,
  location: PropTypes.object,
  mebDpoAddressOptionEnabled: PropTypes.bool,
  setFormData: PropTypes.func,
  user: PropTypes.object,
};

const mapStateToProps = state => {
  const formStateData = state.form?.data || {};
  const prefillData =
    prefillTransformer(null, null, null, state)?.formData || {};

  return {
    ...getAppData(state),
    formData: {
      formId: formStateData.formId || prefillData.formId,
      claimantId: formStateData.claimantId || prefillData.claimantId,
      claimantFullName: {
        ...prefillData.claimantFullName,
        ...formStateData.claimantFullName,
      },
      claimantDateOfBirth:
        formStateData.claimantDateOfBirth || prefillData.claimantDateOfBirth,
      relativeSsn: formStateData.relativeSsn || prefillData.relativeSsn,
      email: formStateData.email || prefillData.email,
      confirmEmail: formStateData.confirmEmail || prefillData.email,
      mobilePhone: formStateData.mobilePhone?.phone
        ? formStateData.mobilePhone
        : prefillData.mobilePhone,
      homePhone: formStateData.homePhone?.phone
        ? formStateData.homePhone
        : prefillData.homePhone,
      mailingAddressInput:
        formStateData.mailingAddressInput || prefillData.mailingAddressInput,
      notificationMethod:
        formStateData.notificationMethod || prefillData.notificationMethod,
      relationshipToMember:
        formStateData.relationshipToMember || prefillData.relationshipToMember,
      highSchoolDiploma:
        formStateData.highSchoolDiploma || prefillData.highSchoolDiploma,
      graduationDate:
        formStateData.graduationDate || prefillData.graduationDate,
      marriageStatus:
        formStateData.marriageStatus || prefillData.marriageStatus,
      marriageDate: formStateData.marriageDate || prefillData.marriageDate,
      remarriageStatus:
        formStateData.remarriageStatus || prefillData.remarriageStatus,
      remarriageDate:
        formStateData.remarriageDate || prefillData.remarriageDate,
      felonyOrWarrant:
        formStateData.felonyOrWarrant || prefillData.felonyOrWarrant,
      chosenBenefit: formStateData.chosenBenefit || prefillData.chosenBenefit,
      sponsors: formStateData.sponsors || prefillData.sponsors,
      serviceData: formStateData.serviceData || prefillData.serviceData,
      mebDpoAddressOptionEnabled:
        formStateData.mebDpoAddressOptionEnabled ||
        prefillData.mebDpoAddressOptionEnabled,
      ...Object.keys(formStateData).reduce((acc, key) => {
        if (formStateData[key] !== undefined && formStateData[key] !== null) {
          acc[key] = formStateData[key];
        }
        return acc;
      }, {}),
    },
    user: state.user,
  };
};

const mapDispatchToProps = {
  getPersonalInformation: fetchPersonalInformation,
  getDuplicateContactInfo: fetchDuplicateContactInfo,
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
