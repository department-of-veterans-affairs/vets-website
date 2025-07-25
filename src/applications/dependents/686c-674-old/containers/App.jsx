import React from 'react';
// import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
// import fromUnixTime from 'date-fns/fromUnixTime';
import { connect } from 'react-redux';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useBrowserMonitoring } from '~/platform/utilities/real-user-monitoring';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import manifest from '../manifest.json';
import formConfig from '../config/form';
import { DOC_TITLE } from '../config/constants';
import { getShouldUseV2 } from '../../686c-674/utils/redirect';

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

  const flipperV2 = featureToggles.vaDependentsV2;

  // TODO: Enable after 100% release
  // const v1Form = savedForms?.find(
  //   form => form?.form === VA_FORM_IDS.FORM_21_686C,
  // );

  // const calendarDays = differenceInCalendarDays(
  //   new Date(),
  //   fromUnixTime(v1Form?.metadata?.createdAt),
  // );

  // const isGreaterThan60Days = calendarDays >= 60;

  // (flipperV2 && hasV1Form && isGreaterThan60Days);

  if (getShouldUseV2(flipperV2, savedForms)) {
    window.location.href =
      '/view-change-dependents/add-remove-form-21-686c-674/';
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
  const { featureToggles, user, vaFileNumber } = state;
  return {
    isLoggedIn: user?.login?.currentlyLoggedIn,
    isLoading: user?.profile?.loading || featureToggles?.loading,
    vaFileNumber,
    featureToggles,
    savedForms: user?.profile?.savedForms,
  };
};

export default connect(mapStateToProps)(App);
