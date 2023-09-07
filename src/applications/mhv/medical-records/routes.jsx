import React from 'react';
import { Switch, Route } from 'react-router-dom';
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
      <Route path="/download-your-medical-records" key="DownloadRecords">
        <DownloadRecordsPage />
      </Route>
      <Route path="/settings" key="Settings">
        <SettingsPage />
      </Route>
      <Route exact path="/allergies" key="Allergies">
        <Allergies />
      </Route>
      <Route exact path="/allergies/:allergyId" key="AllergyDetails">
        <AllergyDetails />
      </Route>
      <Route exact path="/care-summaries-and-notes" key="CareSummariesAndNotes">
        <CareSummariesAndNotes />
      </Route>
      <Route
        exact
        path="/care-summaries-and-notes/:summaryId"
        key="CareSummaryAndNotesDetails"
      >
        <CareSummariesDetails />
      </Route>
      <Route exact path="/vaccines" key="Vaccines">
        <Vaccines />
      </Route>
      <Route path="/vaccines/:vaccineId" key="Vaccine">
        <VaccineDetails />
      </Route>
      <Route exact path="/vitals" key="Vitals">
        <Vitals />
      </Route>
      <Route path="/vitals/:vitalType" key="VitalDetails">
        <VitalDetails />
      </Route>
      <Route exact path="/health-conditions" key="Health Conditions">
        <HealthConditions />
      </Route>
      <Route path="/health-conditions/:conditionId" key="Condition Details">
        <ConditionDetails />
      </Route>
    </Switch>
  </App>
);

export default routes;
