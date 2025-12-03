import React from 'react';
// import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
// Will re-enable when going to prod.
// import { useFeatureToggle } from 'platform/utilities/feature-toggles';
// import IntentToFile from 'platform/shared/itf/IntentToFile';
// import FormApp from 'platform/forms-system/src/js/containers/FormApp';
// import { Element } from 'platform/utilities/scroll';
import formConfig from '../config/form';
// import { useBrowserMonitoring } from '../hooks/useBrowserMonitoring';

export default function MedicalExpenseReportApp({ location, children }) {
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

// DO NOT REMOVE COMMENTED CODE BELOW -- MAY BE USED LATER
// export default function MedicalExpenseReportApp({ location, children }) {
//   //   const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
//   //   const medicalExpenseReportFormEnabled = useToggleValue(
//   //     TOGGLE_NAMES.medicalExpenseReportFormEnabled,
//   //   );
//   //   const pensionMultiplePageResponse = useToggleValue(
//   //     TOGGLE_NAMES.pensionMultiplePageResponse,
//   //   );

//   // const isLoadingFeatures = useSelector(
//   //   state => state?.featureToggles?.loading,
//   // );
//   // const redirectToHowToPage =
//   //   medicalExpenseReportFormEnabled === false &&
//   //   !location.pathname?.includes('/introduction');
//   // if (redirectToHowToPage === true) {
//   //   window.location.href = '/pension/survivors-pension/';
//   // }

//   // Add Datadog UX monitoring to the application
//   // useBrowserMonitoring();

//   // useEffect(
//   //   () => {
//   //     if (!isLoadingFeatures) {
//   //       window.sessionStorage.setItem(
//   //         'showMultiplePageResponse',
//   //         pensionMultiplePageResponse,
//   //       );
//   //     }
//   //   },
//   //   [isLoadingFeatures, pensionMultiplePageResponse],
//   // );

//   // if (isLoadingFeatures !== false || redirectToHowToPage) {
//   //   return <va-loading-indicator message="Loading application..." />;
//   // }

//   // if (!medicalExpenseReportFormEnabled) {
//   //   return <NoFormPage />;
//   // }

//   return (
//     <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
//       {/* <IntentToFile itfType="pension" location={location} disableAutoFocus /> */}
//       {children}
//     </RoutedSavableApp>
//   );
// }

MedicalExpenseReportApp.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
};
