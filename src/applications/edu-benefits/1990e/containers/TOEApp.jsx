import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { setData } from 'platform/forms-system/src/js/actions';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';

import { fetchPersonalInformation, fetchSponsors } from '../actions';
import { SPONSORS_TYPE, SPONSOR_NOT_LISTED_VALUE } from '../constants';

export const TOEApp = ({
  children,
  claimantInfo,
  fetchedSponsors,
  fetchedSponsorsComplete,
  formData,
  getPersonalInfo,
  getSponsors,
  location,
  setFormData,
  sponsors,
  user,
}) => {
  useEffect(
    () => {
      if (user.login.currentlyLoggedIn) {
        if (!claimantInfo) {
          getPersonalInfo();
        } else if (!formData?.claimantId && claimantInfo.claimantId) {
          setFormData({
            ...formData,
            ...claimantInfo,
          });
        }

        if (!fetchedSponsors && !sponsors) {
          getSponsors();
        }

        // Update
        if (
          (formData.fetchedSponsorsComplete === undefined &&
            fetchedSponsorsComplete !== undefined) ||
          (sponsors?.sponsors?.length &&
            !_.isEqual(formData.sponsors, sponsors))
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
      }
    },
    [
      formData,
      setFormData,
      claimantInfo,
      location,
      getPersonalInfo,
      user,
      sponsors,
      getSponsors,
      fetchedSponsors,
      fetchedSponsorsComplete,
    ],
  );

  return (
    <>
      <va-breadcrumbs>
        <a href="/">Home</a>
        <a href="/education/">Education and training</a>
        <a href="/transfer-education-benefits/">Apply for education benefits</a>
      </va-breadcrumbs>

      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </>
  );
};

TOEApp.propTypes = {
  children: PropTypes.object,
  claimantInfo: PropTypes.shape({
    claimantId: PropTypes.number,
  }),
  formData: PropTypes.object,
  getPersonalInfo: PropTypes.func,
  getSponsors: PropTypes.func,
  location: PropTypes.object,
  setFormData: PropTypes.func,
  sponsors: SPONSORS_TYPE,
  user: PropTypes.shape({
    login: PropTypes.shape({
      currentlyLoggedIn: PropTypes.bool,
    }),
  }),
};

const mapStateToProps = state => ({
  claimant: state.data?.formData?.data?.attributes?.claimant,
  fetchedSponsors: state.data?.fetchedSponsors,
  fetchedSponsorsComplete: state.data?.fetchedSponsorsComplete,
  formData: state.form?.data || {},
  sponsors: state.data?.sponsors,
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
)(TOEApp);
