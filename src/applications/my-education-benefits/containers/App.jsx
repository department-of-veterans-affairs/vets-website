import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';

import { fetchPersonalInformation, fetchEligibility } from '../actions';

export const App = ({
  // loggedIn,
  // showNod,
  location,
  children,
  // profile,
  formData,
  setFormData,
  getPersonalInfo,
  firstName,
  getEligibility,
  eligibility,
}) => {
  useEffect(
    () => {
      // Do something like this to redirect The Veteran if there is
      // an error when retrieving data.
      // if (errors && errors.status === '404') {
      //   // redirect
      //   return;
      // }
      if (!firstName) {
        getPersonalInfo();
      }
      if (!eligibility) {
        getEligibility();
      } else if (!formData.eligibility) {
        setFormData({
          ...formData,
          eligibility,
        });
      }
      // The following works and sets data after the initial form load.
      // However, we have to be careful to not wipe out manual from a saved form.
      /* else if (
        userFullName &&
        !formData['view:userFullName'].userFullName.first
      ) {
        setFormData({
          ...formData,
          'view:userFullName': {
            userFullName,
          },
        });
      } */

      // return () => {
      //   cleanup
      // }
    },
    [
      formData,
      setFormData,
      firstName,
      getPersonalInfo,
      getEligibility,
      eligibility,
    ],
  );

  return (
    <>
      <Breadcrumbs>
        <a href="/">Home</a>
        <a href="#">Education and training</a>
        <a href="#">Apply for education benefits</a>
      </Breadcrumbs>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </>
  );
};

const mapStateToProps = state => {
  const formData = state.form?.data || {};
  const firstName = state.data?.formData?.data?.claimant?.firstName;
  const eligibility = state.data?.eligibility;
  // const showNod = noticeOfDisagreementFeature(state);
  // const loggedIn = isLoggedIn(state);
  // const { toursOfDuty } = state;
  return { formData, firstName, eligibility };
};

const mapDispatchToProps = {
  setFormData: setData,
  getPersonalInfo: fetchPersonalInformation,
  getEligibility: fetchEligibility,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
