import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
// import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { setData } from 'platform/forms-system/src/js/actions';
import { getAppData } from '../selectors';

import formConfig from '../config/form';

import {
  fetchPersonalInformation,
  fetchDuplicateContactInfo,
} from '../actions';

function App({
  location,
  children,
  formData,
  setFormData,
  user,
  // fetchDirectDeposit,
  getPersonalInformation,
  getDuplicateContactInfo,
  // email,
  duplicateEmail,
  duplicatePhone,
}) {
  const [fetchedUserInfo, setFetchedUserInfo] = useState(false);
  // const [fetchedDirectDeposit, setFetchedDirectDeposit] = useState(false);

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
        formData?.mobilePhone &&
        formData?.email &&
        !formData?.duplicateEmail &&
        !formData?.duplicatePhone
      ) {
        getDuplicateContactInfo(
          [{ value: formData?.email?.email, dupe: '' }],
          [
            {
              value: formData?.mobilePhone,
              dupe: '',
            },
          ],
        );
      }
    },
    [getDuplicateContactInfo, formData],
  );

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

const mapStateToProps = state => {
  return {
    ...getAppData(state),
    formData: state.form?.data || {},
    claimant: state.data?.formData?.data?.attributes?.claimant,
    // fetchedSponsorsComplete: state.data?.fetchedSponsorsComplete,
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
