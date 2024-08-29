import React from 'react';
import { Route } from 'react-router-dom-v5-compat';
import {
  ConditionalRoute,
  FormRouter,
  transformJSONSchema,
  ReviewPage,
} from '@department-of-veterans-affairs/va-forms-system-core';
import fullSchema from 'vets-json-schema/dist/21P-530-schema.json';
import BenefitsSelection from './pages/BenefitsSelection';
import BurialIntroduction from './pages/BurialIntroduction';
import ClaimantInformation from './pages/ClaimantInformation';
import VeteranInformation from './pages/VeteranInformation';
import BurialInformation from './pages/BurialInformation';
import MilitaryServiceHistory from './pages/MilitaryServiceHistory';
import PreviousNames from './pages/PreviousNames';
import BurialAllowance from './pages/BurialAllowance';
import PlotAllowance from './pages/PlotAllowance';
import ClaimantContactInformation from './pages/ClaimantContactInformation';
import ConfirmationPage from './pages/ConfirmationPage';

const initialValues = transformJSONSchema(fullSchema);

const NoMatch = props => (
  <main style={{ padding: '1rem' }}>
    <p>There is nothing here! {props.name}</p>
  </main>
);

const routes = (
  <FormRouter
    formData={initialValues}
    title="Burial POC"
    subTitle="Example form for Burials using VAFSC"
  >
    <Route index element={<BurialIntroduction title="Introduction Page" />} />
    <Route
      path="/claimant-information"
      element={<ClaimantInformation title="Claimant Information" />}
    />
    <Route
      path="/veteran-information"
      element={<VeteranInformation title="Deceased Veteran Information" />}
    />
    <Route
      path="/veteran-information/burial"
      element={<BurialInformation title="Deceased Veteran Information" />}
    />
    <Route
      path="/military-history/service-periods"
      element={<MilitaryServiceHistory title="Military Service History" />}
    />
    <Route
      path="/military-history/previous-names"
      element={<PreviousNames title="Military history" />}
    />
    <Route
      path="/benefits/selection"
      element={<BenefitsSelection title="Benefits Selection" />}
    />
    <Route
      path="/benefits/burial-allowance"
      element={
        <ConditionalRoute
          title="Benefits Selection"
          type="conditional"
          condition="benefitsSelection.burialAllowance"
        >
          <BurialAllowance />
        </ConditionalRoute>
      }
    />
    <Route
      path="/benefits/plot-allowance"
      element={
        <ConditionalRoute
          title="Benefits Selection"
          type="conditional"
          condition="benefitsSelection.plotAllowance"
        >
          <PlotAllowance />
        </ConditionalRoute>
      }
    />
    <Route
      path="/claimant-contact-information"
      element={
        <ClaimantContactInformation title="Claimant contact information" />
      }
    />
    <Route
      path="/review-and-submit"
      element={<ReviewPage title="Review Your Application" />}
    />
    <Route
      path="/confirmation"
      element={<ConfirmationPage title="Claim submitted" />}
    />
    <Route path="*" element={<NoMatch name="No Routes for App" />} />
  </FormRouter>
);

export default routes;
