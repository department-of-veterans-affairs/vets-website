import React from 'react';
import { Route, Navigate, Routes } from 'react-router-dom-v5-compat';

import { Toggler } from '~/platform/utilities/feature-toggles';

import TogglerRoute from './components/TogglerRoute';
import YourClaimsPageV2 from './containers/YourClaimsPageV2';
import YourClaimLetters from './containers/YourClaimLetters';
import ClaimPage from './containers/ClaimPage';
import ClaimStatusPage from './containers/ClaimStatusPage';
import StemClaimStatusPage from './containers/StemClaimStatusPage';
import FilesPage from './containers/FilesPage';
import DetailsPage from './containers/DetailsPage';
import AskVAPage from './containers/AskVAPage';
import DocumentRequestPage from './containers/DocumentRequestPage';
import ClaimEstimationPage from './containers/ClaimEstimationPage';
import AppealsV2StatusPage from './containers/AppealsV2StatusPage';
import AppealsV2DetailPage from './containers/AppealsV2DetailPage';
import AppealInfo from './containers/AppealInfo';
import ClaimsStatusApp from './containers/ClaimsStatusApp';
import OverviewPage from './containers/OverviewPage';
import Standard5103NoticePage from './containers/Standard5103NoticePage';

const { cstUseClaimDetailsV2 } = Toggler.TOGGLE_NAMES;

const detailsRoute = (
  <TogglerRoute toggleName={cstUseClaimDetailsV2} redirectWhenToggleEnabled>
    <DetailsPage />
  </TogglerRoute>
);

const overviewRoute = (
  <TogglerRoute toggleName={cstUseClaimDetailsV2}>
    <OverviewPage />
  </TogglerRoute>
);

const routes = (
  <Routes>
    <Route path="/" element={<ClaimsStatusApp />}>
      <Route index element={<Navigate to="your-claims" replace />} />
      <Route path="appeals/:id" element={<AppealInfo />}>
        <Route index element={<Navigate to="status" replace />} />
        <Route path="detail" element={<AppealsV2DetailPage />} />
        <Route path="status" element={<AppealsV2StatusPage />} />
      </Route>
      <Route path="your-claims" element={<YourClaimsPageV2 />} />
      <Route path="your-claims/:id" element={<ClaimPage />}>
        <Route index element={<Navigate to="status" replace />} />
        <Route path="ask-va-to-decide" element={<AskVAPage />} />
        <Route
          path="5103-evidence-notice"
          element={<Standard5103NoticePage />}
        />
        <Route path="claim-estimate" element={<ClaimEstimationPage />} />
        <Route path="details" element={detailsRoute} />
        <Route
          path="document-request/:trackedItemId"
          element={<DocumentRequestPage />}
        />
        <Route path="files" element={<FilesPage />} />
        <Route path="overview" element={overviewRoute} />
        <Route path="status" element={<ClaimStatusPage />} />
      </Route>
      <Route path="your-claim-letters" element={<YourClaimLetters />} />
      <Route path="your-stem-claims/:id">
        <Route index element={<Navigate to="status" replace />} />
        <Route path="status" element={<StemClaimStatusPage />} />
      </Route>
    </Route>
  </Routes>
);

export default routes;
