import React from 'react';
import { Route, Navigate, Routes } from 'react-router-dom-v5-compat';
import { MhvPageNotFound } from '@department-of-veterans-affairs/mhv/exports';
import {
  useFeatureToggle,
  TOGGLE_NAMES,
} from 'platform/utilities/feature-toggles';

import TravelPayStatusApp from './containers/TravelPayStatusApp';
import TravelClaimDetails from './components/TravelClaimDetails';
import Mileage from './components/complex-claims/pages/Mileage';
import AgreementPage from './components/complex-claims/pages/AgreementPage';
import ChooseExpenseType from './components/complex-claims/pages/ChooseExpenseType';
import ConfirmationPage from './components/complex-claims/pages/ConfirmationPage';
import ClaimStatusExplainerPage from './containers/pages/ClaimStatusExplainerPage';
import SubmitFlowWrapper from './containers/SubmitFlowWrapper';
import ComplexClaimSubmitFlowWrapper from './containers/ComplexClaimSubmitFlowWrapper';
import ReviewPage from './components/complex-claims/pages/ReviewPage';
import App from './containers/App';

// Function that returns routes based on feature toggle
const getRoutes = () => {
  const RoutesWrapper = () => {
    const { useToggleValue } = useFeatureToggle();
    const isComplexClaimsEnabled = useToggleValue(
      TOGGLE_NAMES.travelPayEnableComplexClaims,
    );

    const fileNewClaimRoute = isComplexClaimsEnabled ? (
      <Route
        path="/file-new-claim/:apptId"
        element={<ComplexClaimSubmitFlowWrapper />}
      >
        <Route index element={<>Intro</>} />
        <Route path=":claimId">
          <Route path="choose-expense" element={<ChooseExpenseType />} />
          <Route path="mileage/:expenseId?" element={<Mileage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="travel-agreement" element={<AgreementPage />} />
          <Route path="confirmation" element={<ConfirmationPage />} />
        </Route>
      </Route>
    ) : (
      <Route path="/file-new-claim/:apptId" element={<SubmitFlowWrapper />} />
    );

    return (
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Navigate to="/claims/" replace />} />
          <Route
            exact
            path="/claims/"
            title="TravelPayHome"
            element={<TravelPayStatusApp />}
          />
          <Route exact path="/help" element={<ClaimStatusExplainerPage />} />
          <Route
            exact
            path="/file-new-claim"
            element={<Navigate to="/" replace />}
          />
          {fileNewClaimRoute}
          <Route path="/claims/:id" element={<TravelClaimDetails />} />
        </Route>
        <Route path="*" element={<MhvPageNotFound />} />
      </Routes>
    );
  };

  return <RoutesWrapper />;
};

export default getRoutes();
