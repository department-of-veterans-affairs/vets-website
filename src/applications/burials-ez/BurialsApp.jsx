import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from '@department-of-veterans-affairs/platform-forms/RoutedSavableApp';
import { useBrowserMonitoring } from './hooks/useBrowserMonitoring';
import formConfig from './config/form';
import { NoFormPage } from './components/NoFormPage';
import migrations from './migrations';
import { setFormVersion } from './reducers';

export default function BurialsApp({ location, children }) {
  const {
    loading: isLoadingFeatures,
    burialFormEnabled,
    burialDocumentUploadUpdate,
    burialLocationOfDeathUpdate,
  } = useSelector(state => state?.featureToggles);
  const dispatch = useDispatch();

  useBrowserMonitoring();

  useEffect(
    () => {
      if (!isLoadingFeatures) {
        window.sessionStorage.setItem(
          'showLocationOfDeath',
          !!burialLocationOfDeathUpdate,
        );
        window.sessionStorage.setItem(
          'showUploadDocuments',
          !!burialDocumentUploadUpdate,
        );
        dispatch(setFormVersion(!burialLocationOfDeathUpdate ? 2 : 3));
      }
    },
    [
      isLoadingFeatures,
      burialLocationOfDeathUpdate,
      burialDocumentUploadUpdate,
      dispatch,
    ],
  );

  if (isLoadingFeatures) {
    return <va-loading-indicator message="Loading application..." />;
  }

  if (!burialFormEnabled) {
    if (location.pathname !== '/introduction') {
      window.location.href = '/burials-memorials/veterans-burial-allowance/';
      return <></>;
    }
    return <NoFormPage />;
  }

  // Temporary overwrite of version until flipper is removed.
  const ldFormConfig = !burialLocationOfDeathUpdate
    ? formConfig
    : {
        ...formConfig,
        migrations,
        version: 3,
      };

  return (
    <RoutedSavableApp formConfig={ldFormConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

BurialsApp.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};
