import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { setData } from 'platform/forms-system/src/js/actions';
import { selectFeatureToggles } from '../utils/selectors/feature-toggles';
import { useBrowserMonitoring } from '../hooks/useBrowserMonitoring';
import formConfig from '../config/form';
import content from '../locales/en/content.json';

const App = props => {
  const { location, children } = props;
  const { data: formData } = useSelector(state => state.form);
  const { isLoadingFeatureFlags: loading, useFacilitiesApi } = useSelector(
    selectFeatureToggles,
  );
  const dispatch = useDispatch();

  // set feature toggle values in form data
  useEffect(
    () => {
      dispatch(
        setData({
          ...formData,
          'view:useFacilitiesAPI': useFacilitiesApi,
        }),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [useFacilitiesApi],
  );

  // Add Datadog UX monitoring to the application
  useBrowserMonitoring();

  return loading ? (
    <va-loading-indicator
      message={content['app-loading-text']}
      class="vads-u-margin-y--4"
      set-focus
    />
  ) : (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
};

App.propTypes = {
  children: PropTypes.any,
  location: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default App;
