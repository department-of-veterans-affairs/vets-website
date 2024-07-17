import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import recordEvent from 'platform/monitoring/record-event';
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

  // find all yes/no check boxes and attach analytics events
  useEffect(
    () => {
      if (!loading) {
        const radios = document.querySelectorAll('input[type="radio"]');
        for (const radio of radios) {
          radio.onclick = e => {
            const label = e.target.nextElementSibling.innerText;
            recordEvent({
              'caregivers-radio-label': label,
              'caregivers-radio-clicked': e.target,
              'caregivers-radio-value-selected': e.target.value,
            });
          };
        }
      }
    },
    [loading, location],
  );

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
