import React from 'react';
import { createRoutes } from 'platform/forms-system/src/js/routing/createRoutes';
import FormApp from 'platform/forms-system/src/js/containers/FormApp';
import { userPromise } from './utilities/auth';
import formConfig from './config/form';
import App from './containers/App';

// Add any new form-upload forms to this list
const formUploadForms = ['21-686c', '21-526EZ', '21-0966'];

userPromise
  .then(user => {
    console.log('User is logged in:', !!user); // eslint-disable-line no-console
  })
  .catch(error => {
    console.error('Error checking user login status:', error); // eslint-disable-line no-console
  });

const routes = formUploadForms.map(formId => {
  const lowerCaseFormId = formId.toLowerCase();
  const config = formConfig(
    `/representative-form-upload/submit-va-form-${formId}`,
  );
  return {
    path: `/submit-va-form-${lowerCaseFormId}`,
    component: ({ location, children }) => (
      <App>
        <FormApp formConfig={config} currentLocation={location}>
          {children}
        </FormApp>
      </App>
    ),
    indexRoute: {
      onEnter: (_nextState, replace) =>
        replace(`/submit-va-form-${lowerCaseFormId}/introduction`),
    },
    childRoutes: createRoutes(config),
  };
});

export default routes;
