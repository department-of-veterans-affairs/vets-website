import App from './containers/App';
import Introduction from './components/Introduction';
import Subtasks from './components/Subtask';
import Results from './components/Results';

const childRoutes = [
  { path: 'introduction', component: Introduction },
  { path: ':questionId', component: Subtasks },
  { path: 'results', component: Results },
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
