import '../../platform/polyfills';
import React from 'react';
import './sass/my-health.scss';

import startApp from '../../platform/startup';
import VerifyMyHealth from './containers/VerifyMyHealth';

startApp({
  component: <VerifyMyHealth />,
  entryName: 'verify-my-health',
});
