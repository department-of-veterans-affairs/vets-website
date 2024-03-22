import React from 'react';
import { Route, Navigate, Routes } from 'react-router-dom-v5-compat';

import { Toggler } from '~/platform/utilities/feature-toggles';

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

const { cstUseClaimDetailsV2 } = Toggler.TOGGLE_NAMES;

const toggledRoutes = (
  <Toggler toggleName={cstUseClaimDetailsV2}>
    <Toggler.Enabled>
      <Route path="overview" element={<OverviewPage />} />,
    </Toggler.Enabled>
    <Toggler.Disabled>
      <Route path="details" element={<DetailsPage />} />,
    </Toggler.Disabled>
  </Toggler>
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
        <Route path="claim-estimate" element={<ClaimEstimationPage />} />
        <Route path="details" element={<DetailsPage />} />
        <Route
          path="document-request/:trackedItemId"
          element={<DocumentRequestPage />}
        />
        <Route path="files" element={<FilesPage />} />
        <Route path="status" element={<ClaimStatusPage />} />
        <Route element={toggledRoutes} />
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
