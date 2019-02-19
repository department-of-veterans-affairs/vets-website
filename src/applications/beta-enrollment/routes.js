import createBetaEnrollmentButton from './createBetaEnrollmentButton';

export const features = {
  healthAccount: 'health_account',
  veteranIdCard: 'veteran_id_card',
  profile: 'profile',
  dashboard: 'dashboard',
  claimIncrease: 'claim_increase',
  allClaims: 'all_claims',
};

const routes = {
  path: '/',
  childRoutes: [
    {
      path: 'personalization',
      component: createBetaEnrollmentButton(features.dashboard, '/dashboard'),
    },
    {
      path: 'all-claims',
      component: createBetaEnrollmentButton(
        features.allClaims,
        '/disability-benefits/apply/form-526-all-claims',
        'Get Started with the Beta Tool',
      ),
    },
  ],
};

export default routes;
