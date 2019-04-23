import createBetaEnrollmentButton from './createBetaEnrollmentButton';

export const features = {
  healthAccount: 'health_account',
  veteranIdCard: 'veteran_id_card',
  profile: 'profile',
  dashboard: 'dashboard',
  claimIncrease: 'claim_increase',
  hca2: 'hca2',
};

const routes = {
  path: '/',
  childRoutes: [
    {
      path: 'personalization',
      component: createBetaEnrollmentButton(features.dashboard, '/dashboard'),
    },
    {
      path: 'hca',
      component: createBetaEnrollmentButton(features.hca2, '/hca2'),
    },
  ],
};

export default routes;
