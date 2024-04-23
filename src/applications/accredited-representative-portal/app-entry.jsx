import React from 'react';
import { Provider } from 'react-redux';

import '@department-of-veterans-affairs/platform-polyfills';
import startReactApp from '@department-of-veterans-affairs/platform-startup/react';

import './sass/accredited-representative-portal.scss';
import reducer from './reducers';
import routes from './routes';
import createReduxStore from './store';

startReactApp(<Provider store={createReduxStore(reducer)}>{routes}</Provider>);
