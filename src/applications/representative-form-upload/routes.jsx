import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { createRoutes } from 'platform/forms-system/src/js/routing/createRoutes';
import FormApp from 'platform/forms-system/src/js/containers/FormApp';
import { userPromise } from './utilities/auth';
import formConfig from './config/form';
import App from './containers/App';

// Add any new form-upload forms to this list
const formUploadForms = ['21-686c'];

userPromise
  .then(user => {
    console.log('User is logged in:', !!user); // eslint-disable-line no-console
  })
  .catch(error => {
    console.error('Error checking user login status:', error); // eslint-disable-line no-console
  });

const routes = (
  <Switch>
    {formUploadForms.map(formId => {
      const lowerCaseFormId = formId.toLowerCase();
      return (
        <Route key={lowerCaseFormId} path={`/${lowerCaseFormId}`}>
          <Route
            index
            render={() => <Redirect to={`/${lowerCaseFormId}/introduction`} />}
          />
          <Route
            path="*"
            render={({ location }) => (
              <App>
                <FormApp formConfig={formConfig} currentLocation={location}>
                  {createRoutes(formConfig)}
                </FormApp>
              </App>
            )}
          />
        </Route>
      );
    })}
  </Switch>
);

export default routes;
