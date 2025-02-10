// ./routes.jsx
import React from 'react';
import App from './containers/App';
import Introduction from './containers/Introduction';
import Subtask from './components/Subtask';
import Results from './components/Results';

const childRoutes = [
  { path: 'introduction', component: Introduction },
  { path: 'results', component: Results },
  {
    path: ':questionId',
    component: props => <Subtask key={props.params.questionId} {...props} />,
  },
];

const routes = {
  path: '/',
  component: App,
  indexRoute: {
    onEnter: (_, replace) => replace('introduction'),
  },
  childRoutes,
};

export default routes;
