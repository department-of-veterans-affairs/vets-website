import createBetaEnrollmentButton from './createBetaEnrollmentButton';

export const features = {
  healthAccount: 'health_account',
  veteranIdCard: 'veteran_id_card',
  profile: 'profile',
  dashboard: 'dashboard',
  claimIncrease: 'claim_increase',
};

const routes = {
  path: '/',
  childRoutes: [
    {
      path: 'personalization',
      component: createBetaEnrollmentButton(features.dashboard, '/dashboard'),
    },
  ],
};

export default routes;
