import createBetaEnrollmentButton from './createBetaEnrollmentButton';
import create526EnrollmentButton from './create526EnrollmentButton';

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
    { path: 'claim-increase', component: create526EnrollmentButton() },
  ],
};

export default routes;
