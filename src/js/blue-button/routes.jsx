import BlueButtonApp from './containers/BlueButtonApp';
import Main from './containers/Main';
import DownloadPage from './containers/DownloadPage';

const routes = {
  path: '/',
  component: BlueButtonApp,
  indexRoute: { component: Main },
  childRoutes: [
    { path: 'download', component: DownloadPage },
  ],
};

export default routes;
