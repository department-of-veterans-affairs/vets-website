import React from 'react';
import { Switch, Route } from 'react-router-dom';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import FeatureFlagRoute from './components/shared/FeatureFlagRoute';
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
import App from './containers/App';

const routes = (
  <App>
    <Switch>
      <Route exact path="/" key="Medical Records Home">
        <LandingPage />
      </Route>
      <Route exact path="/allergies" key="Allergies">
        <Allergies />
      </Route>
      <Route exact path="/allergies/:allergyId" key="AllergyDetails">
        <AllergyDetails />
      </Route>
      <FeatureFlagRoute
        exact
        path="/vaccines"
        key="Vaccines"
        featureFlag={FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayVaccines}
      >
        <Vaccines />
      </FeatureFlagRoute>
      <FeatureFlagRoute
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
      <Route path="/download-all" key="DownloadRecords">
        <DownloadRecordsPage />
      </Route>
      <Route path="/settings" key="Settings">
        <SettingsPage />
      </Route>
    </Switch>
  </App>
);

export default routes;
