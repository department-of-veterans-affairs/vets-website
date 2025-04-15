import App from './containers/App';
import Introduction from './containers/Introduction';
import Questions from './components/Questions';
import Results from './components/Results';

const childRoutes = [
  { path: 'introduction', component: Introduction },
  { path: 'questions/:questionId', component: Questions },
  { path: 'results/:outcomeId', component: Results },
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
