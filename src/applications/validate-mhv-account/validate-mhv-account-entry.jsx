import '../../platform/polyfills';
import React from 'react';

import startApp from '../../platform/startup';
import ValidateMHVAccount from './ValidateMHVAccount';

startApp({
  component: <ValidateMHVAccount />,
  entryName: 'my-health-account-validation',
});
