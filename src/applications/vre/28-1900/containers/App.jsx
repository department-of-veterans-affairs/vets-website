import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { setData } from 'platform/forms-system/src/js/actions';
import formConfig from '../config/form';

function App({ location, children, formData, setFormData }) {
  // Setup feature flags
  const TOGGLE_KEY = 'vrePrefillName';
  const {
    TOGGLE_NAMES,
    useToggleValue,
    useToggleLoadingValue,
  } = useFeatureToggle();
  const vrePrefillNameEnabled = useToggleValue(TOGGLE_NAMES[TOGGLE_KEY]);
  const isLoadingFeatureFlags = useToggleLoadingValue();

  useEffect(
    () => {
      if (
        !isLoadingFeatureFlags &&
        formData[TOGGLE_KEY] !== vrePrefillNameEnabled
      ) {
        setFormData({
          ...formData,
          [`view:${TOGGLE_KEY}`]: vrePrefillNameEnabled,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoadingFeatureFlags, vrePrefillNameEnabled, formData[TOGGLE_KEY]],
  );

  return (
    <>
      {/* <Breadcrumbs /> */}
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        <DowntimeNotification
          appTitle="Veteran Readiness"
          dependencies={[externalServices.vre]}
        >
          {children}
        </DowntimeNotification>
      </RoutedSavableApp>
    </>
  );
}

const mapDispatchToProps = {
  setFormData: setData,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
});

App.propTypes = {
  children: PropTypes.node,
  formData: PropTypes.object,
  location: PropTypes.object,
  setFormData: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

export { App };
