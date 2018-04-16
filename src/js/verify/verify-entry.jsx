import '../../platform/polyfills';
import '../../sass/login.scss';

import React from 'react';

import startApp from '../../platform/startup';

import VerifyApp from './containers/VerifyApp';

startApp({ component: <VerifyApp/> });
