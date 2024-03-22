import React from 'react';
import { createRoutesWithSaveInProgress } from '@department-of-veterans-affairs/platform-forms/save-in-progress/helpers';
import formConfig from './config/form';
import { AuthGuard } from '~/platform/mhv/util/route-guard';
import App from './containers/App';

const route = {
  path: '/',
  component: props => (
    <AuthGuard>
      <App {...props} />
    </AuthGuard>
  ),
  indexRoute: {
    onEnter: (nextState, replace) => replace('/introduction'),
  },
  childRoutes: createRoutesWithSaveInProgress(formConfig).map(childRoute => ({
    ...childRoute,
    component: props => (
      <AuthGuard>
        <childRoute.component {...props} />
      </AuthGuard>
    ),
  })),
};

export default route;
