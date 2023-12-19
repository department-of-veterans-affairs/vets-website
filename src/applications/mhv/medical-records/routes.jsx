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
      <Route exact path="/conditions" key="Health Conditions">
        <HealthConditions />
      </Route>
      <Route path="/conditions/:conditionId" key="Condition Details">
        <ConditionDetails />
      </Route>
      <Route path="/download-all" key="DownloadRecords">
        <DownloadRecordsPage />
      </Route>
      <Route exact path="/labs-and-tests" key="LabsAndTests">
        <LabsAndTests />
      </Route>
      <Route exact path="/labs-and-tests/:labId" key="LabAndTestDetails">
        <LabAndTestDetails />
      </Route>
      <Route
        exact
        path="/labs-and-tests/:labId/images"
        key="RadiologyImagesList"
      >
        <RadiologyImagesList />
      </Route>
      <Route
        exact
        path="/labs-and-tests/:labId/images/:imageId"
        key="RadiologySingleImage"
      >
        <RadiologySingleImage />
      </Route>
      <Route path="/settings" key="Settings">
        <SettingsPage />
      </Route>
      <Route exact path="/summaries-and-notes" key="CareSummariesAndNotes">
        <CareSummariesAndNotes />
      </Route>
      <Route
        exact
        path="/summaries-and-notes/:summaryId"
        key="CareSummaryAndNotesDetails"
      >
        <CareSummariesDetails />
      </Route>
      <Route exact path="/vitals" key="Vitals">
        <Vitals />
      </Route>
      <Route path="/vitals/:vitalType-history" key="VitalDetails">
        <VitalDetails />
      </Route>
    </Switch>
  </App>
);

export default routes;
