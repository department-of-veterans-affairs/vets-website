import React from 'react';
import startReactApp from '@department-of-veterans-affairs/platform-startup/react';
import manifest from './manifest.json';

startReactApp(<div />, { entryName: manifest.entryName });
