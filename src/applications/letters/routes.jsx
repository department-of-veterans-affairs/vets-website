import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom-v5-compat';

import AddressSection from './containers/AddressSection';
import DownloadLetters from './containers/DownloadLetters';
import LettersApp from './containers/LettersApp';
import LetterList from './containers/LetterList';
import Main from './containers/Main';

const routes = (
  <Routes>
    <Route path="/" element={<LettersApp />}>
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

export default routes;
