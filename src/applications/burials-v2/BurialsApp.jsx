import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from '@department-of-veterans-affairs/platform-forms/RoutedSavableApp';
import { VA_FORM_IDS } from '@department-of-veterans-affairs/platform-forms/constants';
import formConfig from './config/form';
import { NoFormPage } from './components/NoFormPage';

export default function BurialsEntry({ location, children }) {
  const { profile } = useSelector(state => state?.user);
  const {
    loading: isLoadingFeatures,
    burialFormEnabled,
    burialFormV2,
  } = useSelector(state => state?.featureToggles);

  if (isLoadingFeatures || !profile || profile.loading) {
    return <va-loading-indicator message="Loading application..." />;
  }

  if (!burialFormEnabled) {
    if (location.pathname !== '/introduction') {
      window.location.href = '/burials-memorials/veterans-burial-allowance/';
      return <></>;
    }
    return <NoFormPage />;
  }

  const metadataVersion2017 = 2;
  const metadataVersion2024 = 3;

  const hasV1Form = profile.savedForms.some(form => {
    return (
      form.form === VA_FORM_IDS.FORM_21P_530 &&
      form.metadata.version === metadataVersion2017
    );
  });
  const hasV2Form = profile.savedForms.some(form => {
    return (
      form.form === VA_FORM_IDS.FORM_21P_530 &&
      form.metadata.version === metadataVersion2024
    );
  });

  const shouldUseV2 =
    !isLoadingFeatures && (hasV2Form || (burialFormV2 && !hasV1Form));
  if (!shouldUseV2) {
    window.location.href = '/burials-and-memorials/application/530/';
    return <></>;
  }

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

BurialsEntry.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};
