import React from 'react';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import fromUnixTime from 'date-fns/fromUnixTime';
import { connect } from 'react-redux';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useBrowserMonitoring } from '~/platform/utilities/real-user-monitoring';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
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
}) {
  const { TOGGLE_NAMES } = useFeatureToggle();
  useBrowserMonitoring({
    location,
    toggleName: TOGGLE_NAMES.disablityBenefitsBrowserMonitoringEnabled,
  });

  // Must match the H1
  document.title = DOC_TITLE;

  // Handle loading
  if (isLoading) {
    return <va-loading-indicator message="Loading your information..." />;
  }

  /**
   * Stay on V1
   * 1. If user has a v1 form in-progress AND less than 60 days old => Stay on V1
   * 2. If the flipper V2 is disabled (aka vaDependentsV2: false) => Stay on V1
   */

  const flipperV2 = featureToggles.vaDependentsV2;
  const hasV1Form = savedForms?.some(
    form => form.form === VA_FORM_IDS.FORM_21_686C,
  );
  const hasV2Form = savedForms?.some(
    form => form.form === VA_FORM_IDS.FORM_21_686CV2,
  );

  const v1Form = savedForms?.find(
    form => form?.form === VA_FORM_IDS.FORM_21_686C,
  );

  const calendarDays = differenceInCalendarDays(
    new Date(),
    fromUnixTime(v1Form?.lastUpdated),
  );
  const isGreaterThan60Days = calendarDays >= 60;

  const shouldUseV2 =
    hasV2Form ||
    (flipperV2 && !hasV1Form) ||
    (flipperV2 && hasV1Form && isGreaterThan60Days);

  if (shouldUseV2) {
    window.location.href =
      '/view-change-dependents/add-remove-form-21-686c-v2/';
    return <></>;
  }

  const content = (
    <article id="form-686c" data-location={`${location?.pathname?.slice(1)}`}>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </article>
  );

  // If on intro page, just return
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
    window.location.replace(`${manifest.rootUrl}`);
    return (
      <va-loading-indicator message="Redirecting to introduction page..." />
    );
  }

  return content;
}

const mapStateToProps = state => {
  // Testing only

  const { featureToggles, user, vaFileNumber } = state;

  const savedForm = user?.profile?.savedForms.filter(
    form => form?.form !== VA_FORM_IDS.FORM_21_686C,
  );
  const ourSaved =
    user?.profile?.savedForms.find(
      form => form?.form === VA_FORM_IDS.FORM_21_686C,
    ) || {};
  // ourSaved.lastUpdated = 1740373200; // 77 days
  ourSaved.lastUpdated = 1745467200;
  // console.log({ ourSaved });

  return {
    isLoggedIn: user?.login?.currentlyLoggedIn,
    isLoading: user?.profile?.loading || featureToggles?.loading,
    vaFileNumber,
    featureToggles,
    savedForms: [{ ...ourSaved }, ...savedForm],
  };
};

export default connect(mapStateToProps)(App);
