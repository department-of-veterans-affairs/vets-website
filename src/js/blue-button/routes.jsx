import BlueButtonApp from './containers/BlueButtonApp';
import Main from './containers/Main';
import Download from './containers/Download';

const routes = {
  path: '/',
  component: BlueButtonApp,
  indexRoute: { component: Main },
  childRoutes: [
    { path: 'download', component: Download },
  ],
};

export default routes;
