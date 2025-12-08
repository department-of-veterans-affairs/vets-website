import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { setData } from 'platform/forms-system/src/js/actions';
import environment from 'platform/utilities/environment';
import { isLoggedIn, selectProfile } from 'platform/user/selectors';

import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { useToggleValue, useToggleLoadingValue } from 'platform/utilities/feature-toggles/useFeatureToggle';
import TOGGLE_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import { generateCoe } from '../../shared/actions';
import formConfig from '../config/form';
import { isLoadingFeatures, showCoeFeature } from '../../shared/utils/helpers';
import { WIP } from '../../shared/components/WIP';
//import { useDefaultFormData } from '../hooks/useDefaultFormData';

function App({
  children,
  getCoe,
  getCoeMock,
  location,
  canApply,
  showCoe,
  formData,
  setFormData
}) {

  //useDefaultFormData();

  const TOGGLE_KEY = 'nickToggle';
  const {
    TOGGLE_NAMES,
    useToggleValue,
    useToggleLoadingValue,
  } = useFeatureToggle();
  const newFormDataEnabled = useToggleValue(TOGGLE_NAMES[TOGGLE_KEY]);
  //console.log('newFormDataEnabled' , newFormDataEnabled);
  const isLoadingFeatureFlags = useToggleLoadingValue();

  useEffect(
    () => {
      //console.log('=== isLoadingFeatureFlags', isLoadingFeatureFlags);
      if (!isLoadingFeatureFlags && formData[TOGGLE_KEY] !== newFormDataEnabled) {
        //console.log('set form data to: ', newFormDataEnabled)
        setFormData({
          ...formData,
          [TOGGLE_KEY]: newFormDataEnabled,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoadingFeatureFlags, newFormDataEnabled, formData[TOGGLE_KEY]],
  );

  useEffect(
    () => {
      if (showCoe) {
        if (typeof getCoeMock === 'function' && !environment.isProduction()) {
          getCoeMock(!canApply);
        } else {
          getCoe(!canApply);
        }
      }
    },
    [showCoe, getCoe, getCoeMock, canApply],
  );

    const isAppLoading = useSelector(
      state => state.featureToggles?.loading || state.user?.profile?.loading,
    );

  if (isAppLoading) {
    return <va-loading-indicator message="Loading application..." />;
  } else {
    // Show WIP alert if the feature flag isn't set
    return showCoe ? (
      <article
        id="form-26-1880"
        data-location={`${location?.pathname?.slice(1)}`}
      >
        <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
          <DowntimeNotification
            appTitle="Certificate of Eligibility Form"
            dependencies={[externalServices.coe]}
          >
            {children}
          </DowntimeNotification>
        </RoutedSavableApp>
      </article>
    ) : (
      <WIP />
    );
  }

  
}

const mapDispatchToProps = {
  getCoe: generateCoe,
  setFormData: setData,
};

const mapStateToProps = state => ({
  canApply: isLoggedIn(state) && selectProfile(state).claims?.coe,
  showCoe: showCoeFeature(state),
  formData: state.form?.data || {},
});

App.propTypes = {
  children: PropTypes.node.isRequired,
  getCoe: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  canApply: PropTypes.bool,
  getCoeMock: PropTypes.func,
  isLoading: PropTypes.bool,
  showCoe: PropTypes.bool,
  formData: PropTypes.object,
  setFormData: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

export { App };
