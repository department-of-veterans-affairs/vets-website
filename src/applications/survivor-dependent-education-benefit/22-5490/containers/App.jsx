import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { setData } from 'platform/forms-system/src/js/actions';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import merge from 'lodash/merge';

import {
  fetchDirectDeposit,
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
  getDirectDeposit,
  getDuplicateContactInfo,
  getPersonalInformation,
  isLOA3,
  location,
  mebDpoAddressOptionEnabled,
  mebBankInfoConfirmationField,
  meb1995InstructionPageUpdateV3,
  meb5490Under18Flow,
  setFormData,
  user,
}) {
  const [fetchedUserInfo, setFetchedUserInfo] = useState(false);
  const [fetchedDirectDeposit, setFetchedDirectDeposit] = useState(false);

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
      getPersonalInformation,
      user?.login?.currentlyLoggedIn,
      setFormData,
    ],
  );

  useEffect(
    () => {
      const fetchAndUpdateDirectDepositInfo = async () => {
        const isLoggedIn = user?.login?.currentlyLoggedIn;
        if (isLoggedIn && isLOA3 && !fetchedDirectDeposit) {
          await getDirectDeposit();
          setFetchedDirectDeposit(true);
        }
      };
      fetchAndUpdateDirectDepositInfo();
    },
    [
      user?.login?.currentlyLoggedIn,
      isLOA3,
      fetchedDirectDeposit,
      getDirectDeposit,
    ],
  );

  useEffect(
    () => {
      if (mebDpoAddressOptionEnabled !== formData.mebDpoAddressOptionEnabled) {
        setFormData({
          ...formData,
          mebDpoAddressOptionEnabled,
        });
      }

      if (meb5490Under18Flow !== formData.meb5490Under18Flow) {
        setFormData({
          ...formData,
          meb5490Under18Flow,
        });
      }
    },
    [mebDpoAddressOptionEnabled, meb5490Under18Flow, formData, setFormData],
  );

  useEffect(
    () => {
      if (
        meb1995InstructionPageUpdateV3 !==
        formData.meb1995InstructionPageUpdateV3
      ) {
        setFormData({
          ...formData,
          meb1995InstructionPageUpdateV3,
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
    },
    [
      meb1995InstructionPageUpdateV3,
      mebBankInfoConfirmationField,
      formData,
      setFormData,
    ],
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
    [getDuplicateContactInfo, formData?.email, formData?.mobilePhone?.phone],
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
  getDirectDeposit: PropTypes.func,
  getDuplicateContactInfo: PropTypes.func,
  getPersonalInformation: PropTypes.func,
  isLOA3: PropTypes.bool,
  location: PropTypes.object,
  meb1995InstructionPageUpdateV3: PropTypes.bool,
  meb5490Under18Flow: PropTypes.bool,
  mebBankInfoConfirmationField: PropTypes.bool,
  mebDpoAddressOptionEnabled: PropTypes.bool,
  setFormData: PropTypes.func,
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
    formData,
    user: state.user,
  };
};

const mapDispatchToProps = {
  getDirectDeposit: fetchDirectDeposit,
  getPersonalInformation: fetchPersonalInformation,
  getDuplicateContactInfo: fetchDuplicateContactInfo,
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
