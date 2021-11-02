import React from 'react';
import { Route, Switch } from 'react-router-dom';

import CheckIn from './pages/CheckIn';
import Confirmation from './pages/Confirmation';
import Demographics from './pages/Demographics';
import NextOfKin from './pages/NextOfKin';
import Error from './pages/Error';
import SeeStaff from './pages/SeeStaff';
import Landing from './pages/Landing';
import UpdateInformationQuestion from './pages/UpdateInformationQuestion';
import ValidateVeteran from './pages/ValidateVeteran';

import withFeatureFlip from './containers/withFeatureFlip';
import withAppointmentData from './containers/withAppointmentData';
import withLoadedData from './containers/withLoadedData';
import withSession from './containers/withSession';
import withToken from './containers/withToken';
import { URLS } from './utils/navigation';

const createRoutesWithStore = () => {
  return (
    <Switch>
      <Route path="/" component={withFeatureFlip(Landing)} />
      <Route
        path={`/${URLS.VALIDATION_NEEDED}`}
        component={withFeatureFlip(withToken(ValidateVeteran))}
      />
      <Route
        path={`/${URLS.DEMOGRAPHICS}`}
        component={withFeatureFlip(withLoadedData(withSession(Demographics)))}
      />
      <Route
        path={`/${URLS.NEXT_OF_KIN}`}
        component={withFeatureFlip(withLoadedData(withSession(NextOfKin)))}
      />
      <Route
        path={`/${URLS.UPDATE_INSURANCE}`}
        component={withFeatureFlip(
          withLoadedData(withSession(UpdateInformationQuestion)),
        )}
      />
      <Route
        path={`/${URLS.DETAILS}`}
        component={withFeatureFlip(withLoadedData(withSession(CheckIn)))}
      />
      <Route
        path={`/${URLS.COMPLETE}`}
        component={withFeatureFlip(withAppointmentData(Confirmation))}
      />
      <Route
        path={`/${URLS.SEE_STAFF}`}
        component={withFeatureFlip(withLoadedData(withSession(SeeStaff)))}
      />
      <Route path={`/${URLS.ERROR}`} component={withFeatureFlip(Error)} />
    </Switch>
  );
};
export default createRoutesWithStore;
