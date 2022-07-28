import React from 'react';
import { Route } from 'react-router-dom-v5-compat';
import {
  ConditionalRoute,
  FormRouter,
} from '@department-of-veterans-affairs/va-forms-system-core';
import BenefitsSelection from './containers/BenefitsSelection';
import BurialIntroduction from './containers/BurialIntroduction';
import ClaimantInformation from './containers/ClaimantInformation';
import VeteranInformation from './containers/VeteranInformation';
import BurialInformation from './containers/BurialInformation';
import MilitaryServiceHistory from './containers/MilitaryServiceHistory';
import PreviousNames from './containers/PreviousNames';
import BurialAllowance from './containers/BurialAllowance';
import PlotAllowance from './containers/PlotAllowance';
import ClaimantContactInformation from './containers/ClaimantContactInformation';
import ReviewPage from './containers/ReviewPage';
import ConfirmationPage from './containers/ConfirmationPage';
import { initialValues } from './config/formikData';

const NoMatch = props => (
  <main style={{ padding: '1rem' }}>
    <p>There is nothing here! {props.name}</p>
  </main>
);

const newRoutes = (
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
      // eslint-disable-next-line prettier/prettier
      element={(
        <ConditionalRoute
          title="Benefits Selection"
          type="conditional"
          condition="benefitsSelection.burialAllowance"
        >
          <BurialAllowance />
        </ConditionalRoute>
        // eslint-disable-next-line prettier/prettier
      )}
    />
    <Route
      path="/benefits/plot-allowance"
      // eslint-disable-next-line prettier/prettier
      element={(
        <ConditionalRoute
          title="Benefits Selection"
          type="conditional"
          condition="benefitsSelection.plotAllowance"
        >
          <PlotAllowance />
        </ConditionalRoute>
        // eslint-disable-next-line prettier/prettier
      )}
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

export default newRoutes;
