import React from 'react';
import { Route, Switch } from 'react-router-dom';
import QuestionnaireApp from './containers/QuestionnaireApp';
import Home from './questionnaire-list/components/Home';

const createRoutesWithStore = () => {
  return (
    <QuestionnaireApp>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/*" exact component={Home} />
      </Switch>
    </QuestionnaireApp>
  );
};
export default createRoutesWithStore;
