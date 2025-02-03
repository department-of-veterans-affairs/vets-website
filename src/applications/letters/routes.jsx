import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom-v5-compat';

import { Toggler } from 'platform/utilities/feature-toggles';
import AddressSection from './containers/AddressSection';
import App from './containers/App';
import DownloadLetters from './containers/DownloadLetters';
import LetterList from './containers/LetterList';
import Main from './containers/Main';
import { LetterPage } from './containers/LetterPage';
import LetterPageWrapper from './containers/LetterPageWrapper';

const letterPageFeatureFlagWrapper = (
  <Toggler.Hoc toggleName={Toggler.TOGGLE_NAMES.lettersPageNewDesign}>
    {toggleValue =>
      toggleValue ? (
        <Navigate to="letter-page" replace />
      ) : (
        <Navigate to="confirm-address" replace />
      )
    }
  </Toggler.Hoc>
);

const routes = (
  <Routes>
    <Route path="/" element={<App />}>
      <Route index element={letterPageFeatureFlagWrapper} />
      <Route element={<DownloadLetters />}>
        <Route element={<AddressSection />} path="confirm-address" />
        <Route element={<Main />}>
          <Route element={<LetterList />} path="letter-list" />
        </Route>
      </Route>
      <Route element={<LetterPageWrapper />}>
        <Route element={<Main />}>
          <Route element={<LetterPage />} path="letter-page" />
        </Route>
      </Route>
    </Route>
  </Routes>
);

export default routes;
