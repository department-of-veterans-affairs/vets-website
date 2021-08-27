import React from 'react';
import { Route, Switch } from 'react-router-dom';

import CheckIn from './pages/CheckIn';
import Confirmation from './pages/Confirmation';
import Error from './pages/Error';
import Failed from './pages/Failed';
import Landing from './pages/Landing';
import UpdateInformationQuestion from './pages/UpdateInformationQuestion';
import ValidateVeteran from './pages/ValidateVeteran';

import withFeatureFlip from './containers/withFeatureFlip';
import withAppointmentData from './containers/withAppointmentData';
import withLowAuthorization from './containers/withLowAuthorization';

import { URLS } from './utils/navigation';

const createRoutesWithStore = () => {
  return (
    <Switch>
      <Route path="/" component={withFeatureFlip(Landing)} />
      <Route
        path={`/${URLS.VALIDATION_NEEDED}`}
        component={withFeatureFlip(ValidateVeteran)}
      />
      <Route
        path={`/${URLS.UPDATE_INSURANCE}`}
        component={withFeatureFlip(
          withLowAuthorization(UpdateInformationQuestion),
        )}
      />
      <Route
        path={`/${URLS.DETAILS}`}
        component={withFeatureFlip(withAppointmentData(CheckIn))}
      />
      <Route
        path={`/${URLS.COMPLETE}`}
        component={withFeatureFlip(withAppointmentData(Confirmation))}
      />
      <Route
        path={`/${URLS.SEE_STAFF}`}
        component={withFeatureFlip(withAppointmentData(Failed))}
      />
      <Route path={`/${URLS.ERROR}`} component={withFeatureFlip(Error)} />
    </Switch>
  );
};
export default createRoutesWithStore;
