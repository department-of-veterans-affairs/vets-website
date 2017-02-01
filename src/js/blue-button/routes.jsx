import BlueButtonApp from './containers/BlueButtonApp';
import DownloadPage from './containers/DownloadPage';

const routes = {
  path: '/',
  component: BlueButtonApp,
  childRoutes: [
    { path: 'download', component: DownloadPage },
  ],
};

export default routes;
