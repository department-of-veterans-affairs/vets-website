import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
// import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { setData } from 'platform/forms-system/src/js/actions';

import formConfig from '../config/form';

import { fetchPersonalInformation, fetchDirectDeposit } from '../actions';

function App({
  location,
  children,
  formData,
  setFormData,
  user,
  // fetchDirectDeposit,
  getPersonalInformation,
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
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

const mapStateToProps = state => ({
  // ...getAppData(state),
  formData: state.form?.data || {},
  claimant: state.data?.formData?.data?.attributes?.claimant,
  // fetchedSponsorsComplete: state.data?.fetchedSponsorsComplete,
  user: state.user,
});

const mapDispatchToProps = {
  fetchDirectDeposit,
  getPersonalInformation: fetchPersonalInformation,
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
