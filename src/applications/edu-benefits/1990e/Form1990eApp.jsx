import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { setData } from 'platform/forms-system/src/js/actions';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

import formConfig from './config/form';
import { SPONSOR_NOT_LISTED_VALUE } from './constants';
import { fetchPersonalInformation, fetchSponsors } from './actions';

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
  user,
}) {
  useEffect(
    () => {
      if (!user.login.currentlyLoggedIn) {
        return;
      }

      if (showUpdatedToeApp !== formData.showUpdatedToeApp) {
        setFormData({
          ...formData,
          showUpdatedToeApp,
        });
      }
      if (!fetchedSponsors && !sponsors) {
        getSponsors();
      }

      // Update
      if (
        (formData.fetchedSponsorsComplete === undefined &&
          fetchedSponsorsComplete !== undefined) ||
        (sponsors?.sponsors?.length && !_.isEqual(formData.sponsors, sponsors))
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
      fetchedSponsors,
      fetchedSponsorsComplete,
      formData,
      getSponsors,
      location,
      setFormData,
      showUpdatedToeApp,
      sponsors,
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
  sponsors: state.data?.sponsors,
  user: state.user,
});

const mapDispatchToProps = {
  setFormData: setData,
  getPersonalInfo: fetchPersonalInformation,
  getSponsors: fetchSponsors,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form1990eEntry);
