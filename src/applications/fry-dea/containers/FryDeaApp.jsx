import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

import { setData } from 'platform/forms-system/src/js/actions';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import formConfig from '../config/form';
import { fetchVeterans, fetchPersonalInformation } from '../actions';
import { VETERANS_TYPE } from '../constants';
import { prefillTransformer } from '../helpers';

function FryDeaApp({
  children,
  formData,
  getVeterans,
  location,
  setFormData,
  showUpdatedFryDeaApp,
  veterans,
  getPersonalInfo,
  claimantInfo,
}) {
  const [fetchedVeterans, setFetchedVeterans] = useState(false);

  useEffect(
    () => {
      if (!fetchedVeterans) {
        getVeterans();
        setFetchedVeterans(true);
      }

      if (
        formData.showUpdatedFryDeaApp !== showUpdatedFryDeaApp ||
        formData.veterans !== veterans
      ) {
        getPersonalInfo();
        setFormData({
          ...formData,
          showUpdatedFryDeaApp,
          veterans,
          ...claimantInfo,
        });
      }
    },
    [
      fetchedVeterans,
      formData,
      getVeterans,
      location.pathname,
      setFormData,
      showUpdatedFryDeaApp,
      veterans,
      claimantInfo,
      getPersonalInfo,
    ],
  );

  return (
    <>
      <va-breadcrumbs>
        <a href="/">Home</a>
        <a href="/education">Education and training</a>
        <a href="/fry-dea">
          Apply for education benefits as an eligible dependent
        </a>
      </va-breadcrumbs>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </>
  );
}

FryDeaApp.propTypes = {
  children: PropTypes.object,
  formData: PropTypes.object,
  getVeterans: PropTypes.func,
  location: PropTypes.string,
  setFormData: PropTypes.func,
  showUpdatedFryDeaApp: PropTypes.bool,
  veterans: VETERANS_TYPE,
  getPersonalInfo: PropTypes.func,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
  showUpdatedFryDeaApp: toggleValues(state)[
    FEATURE_FLAG_NAMES.showUpdatedFryDeaApp
  ],
  veterans: state.data?.veterans,
  claimantInfo: prefillTransformer(null, null, null, state),
});

const mapDispatchToProps = {
  setFormData: setData,
  getVeterans: fetchVeterans,
  getPersonalInfo: fetchPersonalInformation,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FryDeaApp);
