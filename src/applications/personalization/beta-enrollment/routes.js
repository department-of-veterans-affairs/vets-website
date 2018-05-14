import createBetaEnrollmentButton from './containers/BetaEnrollmentButton';

export const features = {
  healthAccount: 'health_account',
  veteranIdCard: 'veteran_id_card',
  profile: 'profile',
  dashboard: 'dashboard'
};

const routes = {
  path: '/',
  childRoutes: [
    { path: 'personalization', component: createBetaEnrollmentButton(features.dashboard, '/dashboard-beta') }
  ]
};

export default routes;
