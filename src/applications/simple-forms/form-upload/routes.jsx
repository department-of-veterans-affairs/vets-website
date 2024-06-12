import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom-v5-compat';

import FormUploadApp from './containers/FormUploadApp';
import UploadPage from './containers/UploadPage';
import ReviewPage from './containers/ReviewPage';
import SubmitPage from './containers/SubmitPage';
import ConfirmationPage from './containers/ConfirmationPage';
import { IdentificationInfoPage, ZipCodePage } from './pages/reviewPages';

const routes = (
  <Routes>
    <Route path="/:id" element={<FormUploadApp />}>
      <Route index element={<Navigate to="upload" replace />} />
      <Route path="upload" element={<UploadPage />} />
      <Route path="review" element={<ReviewPage />} />
      <Route path="review-info" element={<IdentificationInfoPage />} />
      <Route path="review-zip" element={<ZipCodePage />} />
      <Route path="submit" element={<SubmitPage />} />
      <Route path="confirmation" element={<ConfirmationPage />} />
    </Route>
  </Routes>
);

export default routes;
