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

const newRoutes = (
  <Routes>
    <Route path="/" element={<App />}>
      <Route index element={<Navigate to="letter-page" replace />} />
      <Route element={<LetterPageWrapper />}>
        <Route element={<Main />}>
          <Route element={<LetterPage />} path="letter-page" />
        </Route>
      </Route>
    </Route>
  </Routes>
);
const oldRoutes = (
  <Routes>
    <Route path="/" element={<App />}>
      <Route index element={<Navigate to="confirm-address" replace />} />
      <Route element={<DownloadLetters />}>
        <Route element={<AddressSection />} path="confirm-address" />
        <Route element={<Main />}>
          <Route element={<LetterList />} path="letter-list" />
        </Route>
      </Route>
    </Route>
  </Routes>
);

const routes = (
  <Toggler.Hoc toggleName={Toggler.TOGGLE_NAMES.lettersPageNewDesign}>
    {toggleValue => (toggleValue ? newRoutes : oldRoutes)}
  </Toggler.Hoc>
);

export default routes;
