import React from 'react';

import { createRoutes } from 'platform/forms-system/src/js/routing/createRoutes';
import FormApp from 'platform/forms-system/src/js/containers/FormApp';
import { userPromise } from './utilities/auth';
import formConfig from './config/form';
import App from './containers/App';

// Add any new form-upload forms to this list
const formUploadForms = ['21-686c', '21-526EZ'];

userPromise
  .then(user => {
    console.log('User is logged in:', !!user); // eslint-disable-line no-console
  })
  .catch(error => {
    console.error('Error checking user login status:', error); // eslint-disable-line no-console
  });

const routes = formUploadForms.map(formId => {
  const lowerCaseFormId = formId.toLowerCase();
  return {
    path: `/${lowerCaseFormId}`,
    component: ({ location, children }) => (
      <App>
        <FormApp formConfig={formConfig} currentLocation={location}>
          {children}
        </FormApp>
      </App>
    ),
    indexRoute: {
      onEnter: (_nextState, replace) =>
        replace(`/${lowerCaseFormId}/introduction`),
    },
    childRoutes: createRoutes(formConfig),
  };
});

export default routes;
