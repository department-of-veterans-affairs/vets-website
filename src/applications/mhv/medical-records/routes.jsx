import React from 'react';
import { Switch, Route } from 'react-router-dom';
import HealthConditions from './containers/HealthConditions';
import HealthHistory from './containers/HealthHistory';
import VaccineDetails from './containers/VaccineDetails';
import Vaccines from './containers/Vaccines';
import VitalDetails from './containers/VitalDetails';
import Vitals from './containers/Vitals';
import LandingPage from './containers/LandingPage';
import MrBreadcrumbs from './components/MrBreadcrumbs';
import Navigation from './components/Navigation';
import LabsAndTests from './containers/LabsAndTests';
import CareSummariesAndNotes from './containers/CareSummariesAndNotes';
import ConditionDetails from './containers/ConditionDetails';
import LabAndTestDetails from './containers/LabAndTestDetails';
import Allergies from './containers/Allergies';
import ScrollToTop from './components/shared/ScrollToTop';
import AllergyDetails from './containers/AllergyDetails';
import CareSummariesDetails from './containers/CareSummariesDetails';
import ShareRecordsPage from './containers/ShareRecordsPage';
import RadiologyImagesList from './containers/RadiologyImagesList';
import RadiologySingleImage from './containers/RadiologySingleImage';

const routes = (
  <div className="vads-l-grid-container">
    <MrBreadcrumbs />
    <div className="medical-records-container">
      <Navigation />
      <div className="vads-l-grid-container main-content">
        <ScrollToTop />
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
            path="/labs-and-tests/radiology-images/:labId"
            key="RadiologyImagesList"
          >
            <RadiologyImagesList />
          </Route>
          <Route
            exact
            path="/labs-and-tests/radiology-images/:labId/:imageId"
            key="RadiologySingleImage"
          >
            <RadiologySingleImage />
          </Route>
          <Route path="/share-your-medical-record" key="ShareRecords">
            <ShareRecordsPage />
          </Route>
          <Route exact path="/health-history" key="HealthHistory">
            <HealthHistory />
          </Route>
          <Route exact path="/health-history/allergies" key="Allergies">
            <Allergies />
          </Route>
          <Route
            exact
            path="/health-history/allergies/:allergyId"
            key="AllergyDetails"
          >
            <AllergyDetails />
          </Route>
          <Route
            exact
            path="/health-history/care-summaries-and-notes"
            key="CareSummariesAndNotes"
          >
            <CareSummariesAndNotes />
          </Route>
          <Route
            exact
            path="/health-history/care-summaries-and-notes/:summaryId"
            key="CareSummaryAndNotesDetails"
          >
            <CareSummariesDetails />
          </Route>
          <Route exact path="/health-history/vaccines" key="Vaccines">
            <Vaccines />
          </Route>
          <Route path="/health-history/vaccines/:vaccineId" key="Vaccine">
            <VaccineDetails />
          </Route>
          <Route exact path="/health-history/vitals" key="Vitals">
            <Vitals />
          </Route>
          <Route path="/health-history/vitals/:vitalType" key="VitalDetails">
            <VitalDetails />
          </Route>
          <Route
            exact
            path="/health-history/health-conditions"
            key="Health Conditions"
          >
            <HealthConditions />
          </Route>
          <Route
            path="/health-history/health-conditions/:conditionId"
            key="Condition Details"
          >
            <ConditionDetails />
          </Route>
        </Switch>
      </div>
    </div>
  </div>
);

export default routes;
