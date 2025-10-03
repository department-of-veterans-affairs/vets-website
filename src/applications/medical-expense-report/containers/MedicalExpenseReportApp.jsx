import React, { useEffect } from 'react';
// import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
// Will re-enable when going to prod.
// import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { isLoggedIn, isLOA3 } from 'platform/user/selectors';
// import {
//   DowntimeNotification,
//   externalServices,
// } from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
// import IntentToFile from 'platform/shared/itf/IntentToFile';

import formConfig from '../config/form';
// import { NoFormPage } from '../components/NoFormPage';
// import { useBrowserMonitoring } from '../hooks/useBrowserMonitoring';

const MedicalExpenseReportApp = props => {
  const {
    children,
    formData,
    setFormData,
    userIdVerified,
    userLoggedIn,
    location,
  } = props;

  useEffect(
    // add view-fields to formData to support
    // conditional-pages based on User identity-verification
    () => {
      if (formData['view:userLoggedIn'] !== userLoggedIn) {
        setFormData({
          ...formData,
          'view:userLoggedIn': userLoggedIn,
        });
      }
      if (formData['view:userIdVerified'] !== userIdVerified) {
        setFormData({
          ...formData,
          'view:userLoggedIn': userLoggedIn,
          'view:userIdVerified': userIdVerified,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userIdVerified, userLoggedIn],
  );
  //   const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  //   const medicalExpenseReportFormEnabled = useToggleValue(
  //     TOGGLE_NAMES.medicalExpenseReportFormEnabled,
  //   );
  //   const pensionMultiplePageResponse = useToggleValue(
  //     TOGGLE_NAMES.pensionMultiplePageResponse,
  //   );

  // const isLoadingFeatures = useSelector(
  //   state => state?.featureToggles?.loading,
  // );
  // const redirectToHowToPage =
  //   medicalExpenseReportFormEnabled === false &&
  //   !location.pathname?.includes('/introduction');
  // if (redirectToHowToPage === true) {
  //   window.location.href = '/pension/survivors-pension/';
  // }

  // Add Datadog UX monitoring to the application
  // useBrowserMonitoring();

  // useEffect(
  //   () => {
  //     if (!isLoadingFeatures) {
  //       window.sessionStorage.setItem(
  //         'showMultiplePageResponse',
  //         pensionMultiplePageResponse,
  //       );
  //     }
  //   },
  //   [isLoadingFeatures, pensionMultiplePageResponse],
  // );

  // if (isLoadingFeatures !== false || redirectToHowToPage) {
  //   return <va-loading-indicator message="Loading application..." />;
  // }

  // if (!medicalExpenseReportFormEnabled) {
  //   return <NoFormPage />;
  // }

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {/* <IntentToFile
        itfType="medical-expense-report"
        location={location}
        disableAutoFocus
      /> */}
      {children}
    </RoutedSavableApp>
  );
};

MedicalExpenseReportApp.propTypes = {
  children: PropTypes.node.isRequired,
  formData: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  userIdVerified: PropTypes.bool.isRequired,
  userLoggedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  formData: state.form.data,
  userIdVerified: isLOA3(state),
  userLoggedIn: isLoggedIn(state),
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MedicalExpenseReportApp);
