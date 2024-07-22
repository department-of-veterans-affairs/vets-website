import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { VA_FORM_IDS } from '@department-of-veterans-affairs/platform-forms/constants';
import manifest from '../manifest.json';
import formConfig from '../config/form';
import { DOC_TITLE } from '../config/constants';

function App({
  location,
  children,
  isLoggedIn,
  isLoading,
  vaFileNumber,
  featureToggles,
  savedForms,
  formData,
}) {
  const [localFormData, setLocalFormData] = useState(formData);

  useEffect(
    () => {
      if (featureToggles?.vaDependentsNewFieldsForPdf) {
        setLocalFormData(prevFormData => ({
          ...prevFormData,
          useNewPDF: true,
        }));
      }
    },
    [featureToggles],
  );

  document.title = DOC_TITLE;

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
  if (shouldUseV2) {
    window.location.href =
      '/view-change-dependents/add-remove-form-21-686c-v2/';
  }

  const content = (
    <article id="form-686c" data-location={`${location?.pathname?.slice(1)}`}>
      <RoutedSavableApp
        formConfig={formConfig}
        currentLocation={location}
        formData={localFormData}
      >
        {children}
      </RoutedSavableApp>
    </article>
  );

  if (location.pathname === '/introduction') {
    return content;
  }

  // If a user is not logged in OR
  // a user is logged in, but hasn't gone through va file number validation
  // redirect them to the introduction page.
  if (
    !isLoggedIn ||
    (isLoggedIn && !vaFileNumber?.hasVaFileNumber?.VALIDVAFILENUMBER)
  ) {
    document.location.replace(`${manifest.rootUrl}`);
    return (
      <va-loading-indicator message="Redirecting to introduction page..." />
    );
  }

  return content;
}

const mapStateToProps = state => ({
  isLoggedIn: state?.user?.login?.currentlyLoggedIn,
  isLoading: state?.user?.profile?.loading,
  vaFileNumber: state?.vaFileNumber,
  featureToggles: state?.featureToggles,
  savedForms: state?.user?.profile?.savedForms,
  formData: state?.form?.data,
});

export default connect(mapStateToProps)(App);
