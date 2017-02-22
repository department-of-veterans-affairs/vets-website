import HealthRecordsApp from './containers/HealthRecordsApp';
import Main from './containers/Main';
import DownloadPage from './containers/DownloadPage';

const routes = {
  path: '/',
  component: HealthRecordsApp,
  indexRoute: { component: Main },
  childRoutes: [
    { path: 'download', component: DownloadPage },
  ],
};

export default routes;
