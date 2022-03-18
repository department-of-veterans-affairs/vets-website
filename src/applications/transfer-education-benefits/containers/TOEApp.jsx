import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { setData } from 'platform/forms-system/src/js/actions';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';

import { fetchPersonalInformation, fetchSponsors } from '../actions';
import { SPONSORS_TYPE } from '../constants';

export const TOEApp = ({
  children,
  claimantInfo,
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

        if (!sponsors) {
          getSponsors();
        } else if (!formData.sponsors.availableSponsors) {
          setFormData({
            ...formData,
            sponsors: {
              ...formData.sponsors,
              availableSponsors: sponsors,
            },
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
  location: PropTypes.string,
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
  formData: state.form?.data || {},
  user: state.user,
  sponsors: state.data?.sponsors,
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
