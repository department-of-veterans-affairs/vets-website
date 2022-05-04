import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { isArray, isEqual } from 'lodash';

import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { setData } from 'platform/forms-system/src/js/actions';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

import formConfig from './config/form';
import { SPONSOR_NOT_LISTED_VALUE } from './constants';
import {
  fetchPersonalInformation,
  fetchSponsors,
  updateSponsors,
} from './actions';

function Form1990eEntry({
  children,
  dispatchSponsorsChange,
  fetchedSponsors,
  fetchedSponsorsComplete,
  formData,
  getSponsors,
  location,
  setFormData,
  showUpdatedToeApp,
  sponsors,
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

      if (!fetchedSponsors) {
        getSponsors();
      }

      // Update
      if (
        !sponsors?.loadedFromSavedState &&
        isArray(sponsorsSavedState?.sponsors)
      ) {
        dispatchSponsorsChange({
          ...sponsorsSavedState,
          loadedFromSavedState: true,
        });
        setFormData({
          ...formData,
          fetchedSponsorsComplete,
          sponsors: {
            ...sponsorsSavedState,
            loadedFromSavedState: true,
          },
        });
      } else if (
        (formData.fetchedSponsorsComplete === undefined &&
          fetchedSponsorsComplete !== undefined) ||
        (sponsors?.sponsors?.length && !isEqual(formData.sponsors, sponsors))
      ) {
        const selectedSponsors = sponsors.sponsors?.flatMap(
          sponsor => (sponsor.selected ? [sponsor.id] : []),
        );
        if (sponsors.someoneNotListed) {
          selectedSponsors.push(SPONSOR_NOT_LISTED_VALUE);
        }

        setFormData({
          ...formData,
          fetchedSponsorsComplete,
          sponsors,
          selectedSponsors,
          firstSponsor: sponsors.firstSponsor,
        });
      }
    },
    [
      dispatchSponsorsChange,
      fetchedSponsors,
      fetchedSponsorsComplete,
      formData,
      getSponsors,
      location,
      setFormData,
      showUpdatedToeApp,
      sponsors,
      sponsorsSavedState,
    ],
  );

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

const mapSponsors = state => {
  if (isArray(state.form.data.sponsors?.sponsors)) {
    return state.form.data.sponsors;
  }

  if (isArray(state.data?.sponsors?.sponsors)) {
    return state.data.sponsors;
  }

  return {};
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
  showUpdatedToeApp: toggleValues(state)[FEATURE_FLAG_NAMES.showUpdatedToeApp],
  claimant: state.data?.formData?.data?.attributes?.claimant,
  fetchedSponsors: state.data?.fetchedSponsors,
  fetchedSponsorsComplete: state.data?.fetchedSponsorsComplete,
  sponsors: mapSponsors(state),
  sponsorsSavedState: state.form.loadedData?.formData?.sponsors,
  user: state.user,
});

const mapDispatchToProps = {
  dispatchSponsorsChange: updateSponsors,
  getPersonalInfo: fetchPersonalInformation,
  getSponsors: fetchSponsors,
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form1990eEntry);
