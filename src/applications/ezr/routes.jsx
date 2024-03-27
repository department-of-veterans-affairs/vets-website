import React from 'react';
import { createRoutesWithSaveInProgress } from '@department-of-veterans-affairs/platform-forms/save-in-progress/helpers';
import formConfig from './config/form';
import { MyHealthAccessGuard } from '~/platform/mhv/util/route-guard';
import App from './containers/App';

const route = {
  path: '/',
  component: props => (
    <MyHealthAccessGuard>
      <App {...props} />
    </MyHealthAccessGuard>
  ),
  indexRoute: {
    onEnter: (nextState, replace) => replace('/introduction'),
  },
  childRoutes: createRoutesWithSaveInProgress(formConfig).map(childRoute => ({
    ...childRoute,
    component: props => (
      <MyHealthAccessGuard>
        <childRoute.component {...props} />
      </MyHealthAccessGuard>
    ),
  })),
};

export default route;
