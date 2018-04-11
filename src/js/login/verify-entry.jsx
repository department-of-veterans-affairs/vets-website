import '../../platform/polyfills';
import '../../sass/login.scss';

import React from 'react';

import startApp from '../../platform/startup';

import Verify from './components/Verify';

startApp({ component: <Verify/> });
