import React from 'react';
import { Switch, Route } from 'react-router-dom';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { useMyHealthAccessGuard } from '~/platform/mhv/hooks/useMyHealthAccessGuard';
import FeatureFlagRoute from './components/shared/FeatureFlagRoute';
import AppRoute from './components/shared/AppRoute';
import HealthConditions from './containers/HealthConditions';
import VaccineDetails from './containers/VaccineDetails';
import Vaccines from './containers/Vaccines';
import VitalDetails from './containers/VitalDetails';
import Vitals from './containers/Vitals';
import LandingPage from './containers/LandingPage';
import LabsAndTests from './containers/LabsAndTests';
import CareSummariesAndNotes from './containers/CareSummariesAndNotes';
import ConditionDetails from './containers/ConditionDetails';
import LabAndTestDetails from './containers/LabAndTestDetails';
import Allergies from './containers/Allergies';
import AllergyDetails from './containers/AllergyDetails';
import CareSummariesDetails from './containers/CareSummariesDetails';
import SettingsPage from './containers/SettingsPage';
import RadiologyImagesList from './containers/RadiologyImagesList';
import RadiologySingleImage from './containers/RadiologySingleImage';
import DownloadReportPage from './containers/DownloadReportPage';
import DownloadDateRange from './components/DownloadRecords/DowloadDateRange';
import DownloadRecordType from './components/DownloadRecords/DownloadRecordType';
import DownloadFileType from './components/DownloadRecords/DownloadFileType';

const AccessGuardWrapper = ({ children }) => {
  const redirectToMyHealth = useMyHealthAccessGuard();
  if (redirectToMyHealth) {
    return redirectToMyHealth;
  }
  return children;
};

const routes = (
  <AccessGuardWrapper>
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
  </AccessGuardWrapper>
);

export default routes;
