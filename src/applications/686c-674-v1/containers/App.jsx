import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useBrowserMonitoring } from '~/platform/utilities/real-user-monitoring';
import { TOGGLE_NAMES } from '~/platform/utilities/feature-toggles';
import manifest from '../manifest.json';
import formConfig from '../config/form';
import { DOC_TITLE } from '../config/constants';

export default function App(props) {
  const { location, children } = props;
  const { vaDependentsV2, loading } = useSelector(state => ({
    vaDependentsV2: state?.featureToggles?.vaDependentsV2,
    loading: state?.featureToggles?.loading,
  }));
  const isLoggedIn = useSelector(
    state => state?.user?.login?.currentlyLoggedIn,
  );
  const vaFileNumber = useSelector(state => state?.vaFileNumber);

  // Must match the H1
  document.title = DOC_TITLE;

  useBrowserMonitoring({
    location,
    toggleName: TOGGLE_NAMES?.disablityBenefitsBrowserMonitoringEnabled,
  });

  useEffect(
    () => {
      if (vaDependentsV2) {
        window.location.href =
          '/view-change-dependents/add-remove-form-21-686c-v2/';
      }
    },
    [vaDependentsV2],
  );

  // Handle loading
  if (loading) {
    return <va-loading-indicator message="Loading your information..." />;
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
    (isLoggedIn && !vaFileNumber?.hasVaFileNumber?.validVaFileNumber)
  ) {
    window.location.replace(`${manifest.rootUrl}`);
    return (
      <va-loading-indicator message="Redirecting to introduction page..." />
    );
  }

  return content;
}

// const mapStateToProps = state => {
//   const { featureToggles, user, vaFileNumber } = state;
//   return {
//     isLoggedIn: user?.login?.currentlyLoggedIn,
//     isLoading: featureToggles?.loading,
//     vaFileNumber,
//     featureToggles,
//     savedForms: user?.profile?.savedForms,
//   };
// };

// export default connect(mapStateToProps)(App);
// export default App;
