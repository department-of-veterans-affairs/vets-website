import '../../platform/polyfills';
import React from 'react';
import './sass/veteran-id-card.scss';

import startApp from '../../platform/startup';
import VeteranIDCard from './containers/VeteranIDCard';
import Main from './containers/Main';

import reducer from './reducers';

startApp({
  reducer,
  component: (
    <VeteranIDCard>
      <Main />
    </VeteranIDCard>
  ),
});
