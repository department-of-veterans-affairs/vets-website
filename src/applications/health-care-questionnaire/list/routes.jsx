import React from 'react';
import { Route, Switch } from 'react-router-dom';
import QuestionnaireApp from './containers/QuestionnaireApp';

const createRoutesWithStore = () => {
  return (
    <Switch>
      <Route path="/" exact component={QuestionnaireApp} />
      <Route path="/*" exact component={QuestionnaireApp} />
    </Switch>
  );
};
export default createRoutesWithStore;
