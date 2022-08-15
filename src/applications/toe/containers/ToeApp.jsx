import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { isArray } from 'lodash';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { setData } from 'platform/forms-system/src/js/actions';

import formConfig from '../config/form';
import { fetchPersonalInformation, fetchSponsors } from '../actions';
import { mapFormSponsors } from '../helpers';

function ToeApp({
  children,
  formData,
  getSponsors,
  location,
  setFormData,
  sponsors,
  sponsorsInitial,
  sponsorsSavedState,
  user,
}) {
  const [fetchedSponsors, setFetchedSponsors] = useState(false);

  useEffect(
    () => {
      if (!user?.login?.currentlyLoggedIn) {
        return;
      }

      if (!fetchedSponsors) {
        setFetchedSponsors(true);
        getSponsors();
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
      fetchedSponsors,
      formData,
      getSponsors,
      location,
      setFormData,
      sponsors,
      sponsorsInitial,
      sponsorsSavedState,
      user?.login?.currentlyLoggedIn,
    ],
  );

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

const mapStateToProps = state => ({
  formData: state.form?.data || {},
  claimant: state.data?.formData?.data?.attributes?.claimant,
  fetchedSponsors: state.data?.fetchedSponsors,
  fetchedSponsorsComplete: state.data?.fetchedSponsorsComplete,
  sponsors: state.form?.data?.sponsors,
  sponsorsInitial: state?.data?.sponsors,
  sponsorsSavedState: state.form?.loadedData?.formData?.sponsors,
  user: state.user,
});

const mapDispatchToProps = {
  getPersonalInfo: fetchPersonalInformation,
  getSponsors: fetchSponsors,
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToeApp);
