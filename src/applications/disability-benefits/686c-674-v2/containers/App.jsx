import React from 'react';
import { connect } from 'react-redux';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { VA_FORM_IDS } from '@department-of-veterans-affairs/platform-forms/constants';
import formConfig from '../config/form';
import { DOC_TITLE } from '../config/constants';

function App({ location, children, isLoading, featureToggles, savedForms }) {
  // Must match the H1
  document.title = DOC_TITLE;
  // Handle loading
  if (isLoading || !featureToggles || featureToggles.loading) {
    return <va-loading-indicator message="Loading your information..." />;
  }

  const flipperV2 = featureToggles.vaDependentsV2;
  const hasV1Form = savedForms.some(
    form => form.form === VA_FORM_IDS.FORM_21_686C,
  );
  const hasV2Form = savedForms.some(
    form => form.form === VA_FORM_IDS.FORM_21_686CV2,
  );

  const shouldUseV2 = hasV2Form || (flipperV2 && !hasV1Form);
  if (!shouldUseV2) {
    window.location.href = '/view-change-dependents/add-remove-form-21-686c/';
    return null;
  }

  return (
    <article id="form-686c" data-location={`${location?.pathname?.slice(1)}`}>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </article>
  );
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state?.user?.login?.currentlyLoggedIn,
    isLoading: state?.user?.profile?.loading,
    vaFileNumber: state?.vaFileNumber,
    featureToggles: state?.featureToggles,
    savedForms: state?.user?.profile?.savedForms,
  };
};

export default connect(mapStateToProps)(App);
