import createBetaEnrollmentButton from './createBetaEnrollmentButton';
import dashboardManifest from '../../applications/personalization/dashboard/manifest.json';

export const features = {
  healthAccount: 'health_account',
  veteranIdCard: 'veteran_id_card',
  profile: 'profile',
  dashboard: 'dashboard'
};

const routes = {
  path: '/',
  childRoutes: [
    { path: 'personalization', component: createBetaEnrollmentButton(features.dashboard, dashboardManifest.rootUrl) }
  ]
};

export default routes;
