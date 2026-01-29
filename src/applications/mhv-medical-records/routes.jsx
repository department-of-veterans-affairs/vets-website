import React, { Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import { MhvPageNotFound } from '@department-of-veterans-affairs/mhv/exports';
import { useMyHealthAccessGuard } from '~/platform/mhv/hooks/useMyHealthAccessGuard';
import { lazyWithRetry } from '~/platform/utilities/lazy-load-with-retry';
import AppRoute from './components/shared/AppRoute';

// Lazy-loaded components with retry logic for Safari/iOS bfcache issues.
const HealthConditions = lazyWithRetry(() =>
  import('./containers/HealthConditions'),
);
const VaccineDetails = lazyWithRetry(() =>
  import('./containers/VaccineDetails'),
);
const Vaccines = lazyWithRetry(() => import('./containers/Vaccines'));
const VitalDetails = lazyWithRetry(() => import('./containers/VitalDetails'));
const Vitals = lazyWithRetry(() => import('./containers/Vitals'));
const LandingPage = lazyWithRetry(() => import('./containers/LandingPage'));
const LabsAndTests = lazyWithRetry(() => import('./containers/LabsAndTests'));
const CareSummariesAndNotes = lazyWithRetry(() =>
  import('./containers/CareSummariesAndNotes'),
);
const ConditionDetails = lazyWithRetry(() =>
  import('./containers/ConditionDetails'),
);
const LabAndTestDetails = lazyWithRetry(() =>
  import('./containers/LabAndTestDetails'),
);
const Allergies = lazyWithRetry(() => import('./containers/Allergies'));
const AllergyDetails = lazyWithRetry(() =>
  import('./containers/AllergyDetails'),
);
const CareSummariesDetails = lazyWithRetry(() =>
  import('./containers/CareSummariesDetails'),
);
const SettingsPage = lazyWithRetry(() => import('./containers/SettingsPage'));
const RadiologyImagesList = lazyWithRetry(() =>
  import('./containers/RadiologyImagesList'),
);
const RadiologySingleImage = lazyWithRetry(() =>
  import('./containers/RadiologySingleImage'),
);
const DownloadReportPage = lazyWithRetry(() =>
  import('./containers/DownloadReportPage'),
);
const DownloadDateRange = lazyWithRetry(() =>
  import('./components/DownloadRecords/DownloadDateRange'),
);
const DownloadRecordType = lazyWithRetry(() =>
  import('./components/DownloadRecords/DownloadRecordType'),
);
const DownloadFileType = lazyWithRetry(() =>
  import('./components/DownloadRecords/DownloadFileType'),
);

// Loading component to display while lazy-loaded components are being fetched
// and during retry attempts after chunk load failures.
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
        <AppRoute exact path="/vaccines" key="Vaccines">
          <Vaccines />
        </AppRoute>
        <AppRoute exact path="/vaccines/:vaccineId" key="Vaccine">
          <VaccineDetails />
        </AppRoute>
        <AppRoute exact path="/summaries-and-notes" key="CareSummariesAndNotes">
          <CareSummariesAndNotes />
        </AppRoute>
        <AppRoute
          exact
          path="/summaries-and-notes/:summaryId"
          key="CareSummaryAndNotesDetails"
        >
          <CareSummariesDetails />
        </AppRoute>
        <AppRoute exact path="/conditions" key="Health Conditions">
          <HealthConditions />
        </AppRoute>
        <AppRoute exact path="/conditions/:conditionId" key="Condition Details">
          <ConditionDetails />
        </AppRoute>
        <AppRoute exact path="/vitals" key="Vitals">
          <Vitals />
        </AppRoute>

        <AppRoute exact path="/vitals/:vitalType-history" key="VitalDetails">
          <VitalDetails />
        </AppRoute>
        <AppRoute exact path="/labs-and-tests" key="LabsAndTests">
          <LabsAndTests />
        </AppRoute>
        <AppRoute exact path="/labs-and-tests/:labId" key="LabAndTestDetails">
          <LabAndTestDetails />
        </AppRoute>
        <AppRoute
          exact
          path="/labs-and-tests/:labId/images"
          key="RadiologyImagesList"
        >
          <RadiologyImagesList />
        </AppRoute>
        <AppRoute
          exact
          path="/labs-and-tests/:labId/images/:imageId"
          key="RadiologySingleImage"
        >
          <RadiologySingleImage />
        </AppRoute>
        <AppRoute exact path="/settings" key="Settings">
          <SettingsPage />
        </AppRoute>
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
          <MhvPageNotFound />
        </Route>
      </Switch>
    </Suspense>
  </AccessGuardWrapper>
);

export default routes;
