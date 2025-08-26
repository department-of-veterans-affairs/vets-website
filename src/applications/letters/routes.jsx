import React from 'react';
import { Route, Routes } from 'react-router-dom-v5-compat';

import App from './containers/App';
import Main from './containers/Main';
import { LetterPage } from './containers/LetterPage';
import LetterPageWrapper from './containers/LetterPageWrapper';

// const oldRoutes = (
//   <Routes>
//     <Route path="/" element={<App />}>
//       <Route index element={<Navigate to="confirm-address" replace />} />
//       <Route element={<DownloadLetters />}>
//         <Route element={<AddressSection />} path="confirm-address" />
//         <Route element={<Main />}>
//           <Route element={<LetterList />} path="letter-list" />
//         </Route>
//       </Route>
//     </Route>
//   </Routes>
// );

const routes = (
  <Routes>
    <Route path="/" element={<App />}>
      <Route element={<LetterPageWrapper />}>
        <Route element={<Main />}>
          <Route index element={<LetterPage />} />
        </Route>
      </Route>
    </Route>
  </Routes>
);

export default routes;
