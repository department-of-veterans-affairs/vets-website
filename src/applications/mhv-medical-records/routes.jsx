import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { useMyHealthAccessGuard } from '~/platform/mhv/hooks/useMyHealthAccessGuard';
import FeatureFlagRoute from './components/shared/FeatureFlagRoute';
import AppRoute from './components/shared/AppRoute';

// Lazy-loaded components
const HealthConditions = lazy(() => import('./containers/HealthConditions'));
const VaccineDetails = lazy(() => import('./containers/VaccineDetails'));
const Vaccines = lazy(() => import('./containers/Vaccines'));
const VitalDetails = lazy(() => import('./containers/VitalDetails'));
const Vitals = lazy(() => import('./containers/Vitals'));
const LandingPage = lazy(() => import('./containers/LandingPage'));
const LabsAndTests = lazy(() => import('./containers/LabsAndTests'));
const CareSummariesAndNotes = lazy(() =>
  import('./containers/CareSummariesAndNotes'),
);
const ConditionDetails = lazy(() => import('./containers/ConditionDetails'));
const LabAndTestDetails = lazy(() => import('./containers/LabAndTestDetails'));
const Allergies = lazy(() => import('./containers/Allergies'));
const AllergyDetails = lazy(() => import('./containers/AllergyDetails'));
const CareSummariesDetails = lazy(() =>
  import('./containers/CareSummariesDetails'),
);
const SettingsPage = lazy(() => import('./containers/SettingsPage'));
const RadiologyImagesList = lazy(() =>
  import('./containers/RadiologyImagesList'),
);
const RadiologySingleImage = lazy(() =>
  import('./containers/RadiologySingleImage'),
);
const DownloadReportPage = lazy(() =>
  import('./containers/DownloadReportPage'),
);
const DownloadDateRange = lazy(() =>
  import('./components/DownloadRecords/DownloadDateRange'),
);
const DownloadRecordType = lazy(() =>
  import('./components/DownloadRecords/DownloadRecordType'),
);
const DownloadFileType = lazy(() =>
  import('./components/DownloadRecords/DownloadFileType'),
);

// Loading component to display while lazy-loaded components are being fetched
const Loading = () => (
  <va-loading-indicator
    message="Loading..."
    set-focus
    data-testid="loading-indicator"
  />
);

const AccessGuardWrapper = ({ children }) => {
  const redirectToMyHealth = useMyHealthAccessGuard();
  if (redirectToMyHealth) {
    return redirectToMyHealth;
  }
  return children;
};

const routes = (
  <AccessGuardWrapper>
    <Suspense fallback={<Loading />}>
      <Switch>
        <AppRoute exact path="/" key="Medical Records Home">
          <LandingPage />
        </AppRoute>
        <AppRoute exact path="/allergies" key="Allergies">
          <Allergies />
        </AppRoute>
        <AppRoute exact path="/allergies/:allergyId" key="AllergyDetails">
          <AllergyDetails />
        </AppRoute>
        <FeatureFlagRoute
          exact
          path="/vaccines"
          key="Vaccines"
          featureFlag={FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayVaccines}
        >
          <Vaccines />
        </FeatureFlagRoute>
        <FeatureFlagRoute
          exact
          path="/vaccines/:vaccineId"
          key="Vaccine"
          featureFlag={FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayVaccines}
        >
          <VaccineDetails />
        </FeatureFlagRoute>
        <FeatureFlagRoute
          exact
          path="/summaries-and-notes"
          key="CareSummariesAndNotes"
          featureFlag={FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayNotes}
        >
          <CareSummariesAndNotes />
        </FeatureFlagRoute>
        <FeatureFlagRoute
          exact
          path="/summaries-and-notes/:summaryId"
          key="CareSummaryAndNotesDetails"
          featureFlag={FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayNotes}
        >
          <CareSummariesDetails />
        </FeatureFlagRoute>
        <FeatureFlagRoute
          exact
          path="/conditions"
          key="Health Conditions"
          featureFlag={FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayConditions}
        >
          <HealthConditions />
        </FeatureFlagRoute>
        <FeatureFlagRoute
          exact
          path="/conditions/:conditionId"
          key="Condition Details"
          featureFlag={FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayConditions}
        >
          <ConditionDetails />
        </FeatureFlagRoute>
        <FeatureFlagRoute
          exact
          path="/vitals"
          key="Vitals"
          featureFlag={FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayVitals}
        >
          <Vitals />
        </FeatureFlagRoute>
        <FeatureFlagRoute
          exact
          path="/vitals/:vitalType-history"
          key="VitalDetails"
          featureFlag={FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayVitals}
        >
          <VitalDetails />
        </FeatureFlagRoute>
        <FeatureFlagRoute
          exact
          path="/labs-and-tests"
          key="LabsAndTests"
          featureFlag={FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayLabsAndTests}
        >
          <LabsAndTests />
        </FeatureFlagRoute>
        <FeatureFlagRoute
          exact
          path="/labs-and-tests/:labId"
          key="LabAndTestDetails"
          featureFlag={FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayLabsAndTests}
        >
          <LabAndTestDetails />
        </FeatureFlagRoute>
        <FeatureFlagRoute
          exact
          path="/labs-and-tests/:labId/images"
          key="RadiologyImagesList"
          featureFlag={FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayLabsAndTests}
        >
          <RadiologyImagesList />
        </FeatureFlagRoute>
        <FeatureFlagRoute
          exact
          path="/labs-and-tests/:labId/images/:imageId"
          key="RadiologySingleImage"
          featureFlag={FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayLabsAndTests}
        >
          <RadiologySingleImage />
        </FeatureFlagRoute>
        <FeatureFlagRoute
          exact
          path="/settings"
          key="Settings"
          featureFlag={FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplaySettingsPage}
        >
          <SettingsPage />
        </FeatureFlagRoute>
        <AppRoute exact path="/download" key="Download">
          <DownloadReportPage />
        </AppRoute>
        <AppRoute exact path="/download/date-range" key="Download-date-range">
          <DownloadDateRange />
        </AppRoute>
        <AppRoute exact path="/download/record-type" key="Download-record-type">
          <DownloadRecordType />
        </AppRoute>
        <AppRoute exact path="/download/file-type" key="Download-file-type">
          <DownloadFileType />
        </AppRoute>
        <Route>
          <PageNotFound />
        </Route>
      </Switch>
    </Suspense>
  </AccessGuardWrapper>
);

export default routes;
