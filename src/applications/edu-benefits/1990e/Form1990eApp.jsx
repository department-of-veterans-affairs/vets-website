import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { isArray } from 'lodash';

import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { setData } from 'platform/forms-system/src/js/actions';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

import formConfig from './config/form';
import { fetchPersonalInformation, fetchSponsors } from './actions';
import { mapFormSponsors } from './helpers';

function Form1990eEntry({
  children,
  fetchedSponsors,
  fetchedSponsorsComplete,
  formData,
  getSponsors,
  location,
  setFormData,
  showUpdatedToeApp,
  sponsors,
  sponsorsInitial,
  sponsorsSavedState,
  // user,
}) {
  useEffect(
    () => {
      if (showUpdatedToeApp !== formData.showUpdatedToeApp) {
        setFormData({
          ...formData,
          showUpdatedToeApp,
        });
      }

      // TODO Not sure why, but currentlyLoggedIn is false in some
      // cases, even when a user is logged in.
      // if (!user.login.currentlyLoggedIn) {
      //   return;
      // }

      if (showUpdatedToeApp && !fetchedSponsors) {
        getSponsors();
      }

      if (
        showUpdatedToeApp &&
        !sponsors?.loadedFromSavedState &&
        isArray(sponsorsSavedState?.sponsors)
      ) {
        setFormData(
          mapFormSponsors(
            formData,
            sponsorsSavedState,
            fetchedSponsorsComplete,
          ),
        );
      } else if (showUpdatedToeApp && sponsorsInitial && !sponsors) {
        setFormData(
          mapFormSponsors(formData, sponsorsInitial, fetchedSponsorsComplete),
        );
      }
    },
    [
      fetchedSponsors,
      fetchedSponsorsComplete,
      formData,
      getSponsors,
      location,
      setFormData,
      showUpdatedToeApp,
      sponsors,
      sponsorsInitial,
      sponsorsSavedState,
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
  showUpdatedToeApp: toggleValues(state)[FEATURE_FLAG_NAMES.showUpdatedToeApp],
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
)(Form1990eEntry);
