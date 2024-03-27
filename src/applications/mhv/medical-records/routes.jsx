import React from 'react';
import { Switch, Route } from 'react-router-dom';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
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
import DownloadRecordsPage from './containers/DownloadRecordsPage';
import SettingsPage from './containers/SettingsPage';
import RadiologyImagesList from './containers/RadiologyImagesList';
import RadiologySingleImage from './containers/RadiologySingleImage';
import { MyHealthAccessGuard } from '~/platform/mhv/util/route-guard';

const routes = (
  <Switch>
    <AppRoute exact path="/" key="Medical Records Home">
      <MyHealthAccessGuard>
        <LandingPage />
      </MyHealthAccessGuard>
    </AppRoute>
    <AppRoute exact path="/allergies" key="Allergies">
      <MyHealthAccessGuard>
        <Allergies />
      </MyHealthAccessGuard>
    </AppRoute>
    <AppRoute exact path="/allergies/:allergyId" key="AllergyDetails">
      <MyHealthAccessGuard>
        <AllergyDetails />
      </MyHealthAccessGuard>
    </AppRoute>
    <FeatureFlagRoute
      exact
      path="/vaccines"
      key="Vaccines"
      featureFlag={FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayVaccines}
    >
      <MyHealthAccessGuard>
        <Vaccines />
      </MyHealthAccessGuard>
    </FeatureFlagRoute>
    <FeatureFlagRoute
      exact
      path="/vaccines/:vaccineId"
      key="Vaccine"
      featureFlag={FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayVaccines}
    >
      <MyHealthAccessGuard>
        <VaccineDetails />
      </MyHealthAccessGuard>
    </FeatureFlagRoute>
    <FeatureFlagRoute
      exact
      path="/summaries-and-notes"
      key="CareSummariesAndNotes"
      featureFlag={FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayNotes}
    >
      <MyHealthAccessGuard>
        <CareSummariesAndNotes />
      </MyHealthAccessGuard>
    </FeatureFlagRoute>
    <FeatureFlagRoute
      exact
      path="/summaries-and-notes/:summaryId"
      key="CareSummaryAndNotesDetails"
      featureFlag={FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayNotes}
    >
      <MyHealthAccessGuard>
        <CareSummariesDetails />
      </MyHealthAccessGuard>
    </FeatureFlagRoute>
    <FeatureFlagRoute
      exact
      path="/conditions"
      key="Health Conditions"
      featureFlag={FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayConditions}
    >
      <MyHealthAccessGuard>
        <HealthConditions />
      </MyHealthAccessGuard>
    </FeatureFlagRoute>
    <FeatureFlagRoute
      exact
      path="/conditions/:conditionId"
      key="Condition Details"
      featureFlag={FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayConditions}
    >
      <MyHealthAccessGuard>
        <ConditionDetails />
      </MyHealthAccessGuard>
    </FeatureFlagRoute>
    <FeatureFlagRoute
      exact
      path="/vitals"
      key="Vitals"
      featureFlag={FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayVitals}
    >
      <MyHealthAccessGuard>
        <Vitals />
      </MyHealthAccessGuard>
    </FeatureFlagRoute>
    <FeatureFlagRoute
      exact
      path="/vitals/:vitalType-history"
      key="VitalDetails"
      featureFlag={FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayVitals}
    >
      <MyHealthAccessGuard>
        <VitalDetails />
      </MyHealthAccessGuard>
    </FeatureFlagRoute>
    <FeatureFlagRoute
      exact
      path="/labs-and-tests"
      key="LabsAndTests"
      featureFlag={FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayLabsAndTests}
    >
      <MyHealthAccessGuard>
        <LabsAndTests />
      </MyHealthAccessGuard>
    </FeatureFlagRoute>
    <FeatureFlagRoute
      exact
      path="/labs-and-tests/:labId"
      key="LabAndTestDetails"
      featureFlag={FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayLabsAndTests}
    >
      <MyHealthAccessGuard>
        <LabAndTestDetails />
      </MyHealthAccessGuard>
    </FeatureFlagRoute>
    <FeatureFlagRoute
      exact
      path="/labs-and-tests/:labId/images"
      key="RadiologyImagesList"
      featureFlag={FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayLabsAndTests}
    >
      <MyHealthAccessGuard>
        <RadiologyImagesList />
      </MyHealthAccessGuard>
    </FeatureFlagRoute>
    <FeatureFlagRoute
      exact
      path="/labs-and-tests/:labId/images/:imageId"
      key="RadiologySingleImage"
      featureFlag={FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayLabsAndTests}
    >
      <MyHealthAccessGuard>
        <RadiologySingleImage />
      </MyHealthAccessGuard>
    </FeatureFlagRoute>
    <AppRoute exact path="/download-all" key="DownloadRecords">
      <MyHealthAccessGuard>
        <DownloadRecordsPage />
      </MyHealthAccessGuard>
    </AppRoute>
    <AppRoute exact path="/settings" key="Settings">
      <MyHealthAccessGuard>
        <SettingsPage />
      </MyHealthAccessGuard>
    </AppRoute>
    <Route>
      <MyHealthAccessGuard>
        <PageNotFound />
      </MyHealthAccessGuard>
    </Route>
  </Switch>
);

export default routes;
