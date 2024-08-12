import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

import { setData } from 'platform/forms-system/src/js/actions';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import formConfig from '../config/form';
import { fetchVeterans } from '../actions';
import { VETERANS_TYPE } from '../constants';

function FryDeaApp({
  children,
  formData,
  getVeterans,
  location,
  setFormData,
  showUpdatedFryDeaApp,
  user,
  veterans,
}) {
  const [fetchedVeterans, setFetchedVeterans] = useState(false);

  useEffect(
    () => {
      if (!user.login.currentlyLoggedIn) {
        return;
      }

      if (!fetchedVeterans) {
        setFetchedVeterans(true);
        getVeterans();
      }

      if (
        formData.showUpdatedFryDeaApp !== showUpdatedFryDeaApp ||
        formData.veterans !== veterans
      ) {
        setFormData({
          ...formData,
          showUpdatedFryDeaApp,
          veterans,
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
      user.login.currentlyLoggedIn,
      veterans,
    ],
  );

  const breadCrumbs = [
    { href: '/', label: 'Home' },
    { href: '/education', label: 'Education and training' },
    {
      href: '/fry-dea',
      label: 'Apply for eduction benefits as an eligible dependent',
    },
  ];
  const bcString = JSON.stringify(breadCrumbs);

  return (
    <>
      <va-breadcrumbs breadcrumb-list={bcString} />
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
  location: PropTypes.object,
  setFormData: PropTypes.func,
  showUpdatedFryDeaApp: PropTypes.bool,
  veterans: VETERANS_TYPE,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
  showUpdatedFryDeaApp: toggleValues(state)[
    FEATURE_FLAG_NAMES.showUpdatedFryDeaApp
  ],
  user: state?.user,
  veterans: state.data?.veterans,
});

const mapDispatchToProps = {
  setFormData: setData,
  getVeterans: fetchVeterans,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FryDeaApp);
