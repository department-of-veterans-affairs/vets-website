import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { isArray } from 'lodash';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { setData } from 'platform/forms-system/src/js/actions';

import formConfig from '../config/form';
import {
  fetchSponsors,
  fetchPersonalInformation,
  fetchDirectDeposit,
} from '../actions';
import { mapFormSponsors } from '../helpers';
import { SPONSORS_TYPE } from '../constants';

function ToeApp({
  children,
  formData,
  getSponsors,
  getDirectDeposit,
  getPersonalInformation,
  location,
  setFormData,
  sponsors,
  sponsorsInitial,
  sponsorsSavedState,
  user,
}) {
  const [fetchedSponsors, setFetchedSponsors] = useState(false);
  const [fetchedUserInfo, setFetchedUserInfo] = useState(false);
  const [fetchedDirectDeposit, setFetchedDirectDeposit] = useState(false);

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
      location,
      setFormData,
      getSponsors,
      sponsors,
      sponsorsInitial,
      sponsorsSavedState,
      user?.login?.currentlyLoggedIn,
    ],
  );

  useEffect(
    () => {
      if (!user?.login?.currentlyLoggedIn) {
        return;
      }
      if (!fetchedUserInfo) {
        setFetchedUserInfo(true);
        getPersonalInformation();
      }
    },
    [fetchedUserInfo, getPersonalInformation, user?.login?.currentlyLoggedIn],
  );

  useEffect(
    () => {
      if (!user?.login?.currentlyLoggedIn) {
        return;
      }
      if (!fetchedDirectDeposit) {
        setFetchedDirectDeposit(true);
        getDirectDeposit();
      }
    },
    [fetchedDirectDeposit, getDirectDeposit, user?.login?.currentlyLoggedIn],
  );

  return (
    <>
      <va-breadcrumbs>
        <a href="/">Home</a>
        <a href="/education">Education and training</a>
        <a href="/education/survivor-dependent-benefits/apply-for-transferred-benefits-form-22-1990e">
          Apply to use transferred education benefits
        </a>
      </va-breadcrumbs>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </>
  );
}

ToeApp.propTypes = {
  children: PropTypes.object,
  formData: PropTypes.object,
  getDirectDeposit: PropTypes.func,
  getPersonalInformation: PropTypes.func,
  getSponsors: PropTypes.func,
  location: PropTypes.object,
  setFormData: PropTypes.func,
  showUpdatedFryDeaApp: PropTypes.bool,
  sponsors: SPONSORS_TYPE,
  sponsorsInitial: SPONSORS_TYPE,
  sponsorsSavedState: SPONSORS_TYPE,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
  claimant: state.data?.formData?.data?.attributes?.claimant,
  fetchedSponsorsComplete: state.data?.fetchedSponsorsComplete,
  sponsors: state.form?.data?.sponsors,
  sponsorsInitial: state?.data?.sponsors,
  sponsorsSavedState: state.form?.loadedData?.formData?.sponsors,
  user: state.user,
});

const mapDispatchToProps = {
  getDirectDeposit: fetchDirectDeposit,
  getSponsors: fetchSponsors,
  getPersonalInformation: fetchPersonalInformation,
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToeApp);
