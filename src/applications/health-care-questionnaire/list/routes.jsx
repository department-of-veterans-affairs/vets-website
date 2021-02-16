import React from 'react';
import { Route, Switch } from 'react-router-dom';
import QuestionnaireApp from './containers/QuestionnaireApp';

import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './answer-questions/config/form';

const createRoutesWithStore = () => {
  const childRoutes = createRoutesWithSaveInProgress(formConfig);

  // console.log({ childRoutes });

  return (
    <Switch>
      <Route path="/" exact component={QuestionnaireApp} />
      {childRoutes.map(route => {
        return (
          <Route
            key={route.path}
            path={`form/${route.path}`}
            component={route.component}
            formConfig={route.formConfig}
            pageList={route.pageList}
            pageConfig={route.pageConfig}
          />
        );
      })}
      <Route path="/*" exact component={QuestionnaireApp} />
    </Switch>
  );
};
export default createRoutesWithStore;
