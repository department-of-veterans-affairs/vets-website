import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import cookie from 'js-cookie';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import PropTypes from 'prop-types';
import React from 'react';
import BreadCrumbs from '../components/BreadCrumbs';
import ProgressBar from '../components/ProgressBar';
import formConfig from '../config/form';

export default function App({ location, children }) {
  const {
    TOGGLE_NAMES,
    useToggleLoadingValue,
    useToggleValue,
  } = useFeatureToggle();

  // manually set cookie to true to force new VA.gov experience
  const isCanaryEnabledViaCookie =
    cookie.get('askVaCanaryReleaseOverride') === 'true';

  const toggleName = TOGGLE_NAMES.askVaCanaryRelease;
  const isCanaryEnabled = useToggleValue(toggleName);
  const isLoadingFeatureFlags = useToggleLoadingValue(toggleName);
  const performRedirect =
    !isLoadingFeatureFlags && !(isCanaryEnabled || isCanaryEnabledViaCookie);

  if (performRedirect) {
    window.location.href = 'https://ask.va.gov/';
    return <></>;
  }

  return (
    <>
      <BreadCrumbs currentLocation={location.pathname} />
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        <ProgressBar pathname={location.pathname} />
        {children}
      </RoutedSavableApp>
    </>
  );
}

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
};
