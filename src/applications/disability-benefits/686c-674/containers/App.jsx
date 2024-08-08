import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { VA_FORM_IDS } from '@department-of-veterans-affairs/platform-forms/constants';
import { apiRequest } from 'platform/utilities/api';
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
  const [localFormData, setLocalFormData] = useState(formData || {});
  const [loading, setLoading] = useState(true);

  useEffect(
    () => {
      const resource = '/in_progress_forms/686C-674';

      apiRequest(resource)
        .then(responseData => {
          const fetchedFormData = responseData?.formData || {};

          if (featureToggles?.vaDependentsNewFieldsForPdf) {
            // If feature toggle is true and useNewPDF doesn't exist, add it
            if (!fetchedFormData.useNewPDF) {
              const updatedData = {
                formData: { ...fetchedFormData, useNewPDF: true },
                metaData: { ...responseData.metaData },
              };

              return apiRequest(resource, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
              }).then(() => updatedData);
            }
          } else if (fetchedFormData.useNewPDF) {
            // If feature toggle is false and useNewPDF exists, remove it
            // eslint-disable-next-line no-unused-vars
            const { useNewPDF, ...updatedFormData } = fetchedFormData;
            const updatedData = {
              formData: { ...fetchedFormData, useNewPDF: false },
              metaData: { ...responseData.metaData },
            };

            return apiRequest(resource, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updatedData),
            }).then(() => updatedData);
          }

          return responseData;
        })
        .then(responseData => {
          // Set the updated formData to local state
          setLocalFormData(responseData.formData);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    },
    [featureToggles],
  );

  if (loading || isLoading || !featureToggles || featureToggles.loading) {
    return <va-loading-indicator message="Loading your information..." />;
  }

  document.title = DOC_TITLE;

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
    return null;
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
