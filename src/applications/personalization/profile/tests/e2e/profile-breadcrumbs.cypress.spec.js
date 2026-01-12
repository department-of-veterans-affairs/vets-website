import serviceHistory from '../fixtures/service-history-success.json';
import fullName from '../fixtures/full-name-success.json';
import disabilityRating from '../fixtures/disability-rating-success.json';
import error500 from '../fixtures/500.json';

import { mockUser } from '../fixtures/users/user';
import { PROFILE_PATH_NAMES, PROFILE_PATHS } from '../../constants';
import { generateFeatureToggles } from '../../mocks/endpoints/feature-toggles';
// Cypress bundles test files with esbuild, which lacks our webpack loaders and
// module resolution for SCSS and certain packages. Importing
// `routesForNav.js` pulls in many React components that rely on those loaders,
// causing the spec bundle to fail. To keep this spec lightweight and focused
// on asserting breadcrumbs, we define the minimal route metadata here instead
// of importing the production module.

const routes = [
  {
    name: PROFILE_PATH_NAMES.PERSONAL_INFORMATION,
    path: PROFILE_PATHS.PERSONAL_INFORMATION,
  },
  {
    name: PROFILE_PATH_NAMES.CONTACT_INFORMATION,
    path: PROFILE_PATHS.CONTACT_INFORMATION,
  },
  {
    name: PROFILE_PATH_NAMES.SERVICE_HISTORY_INFORMATION,
    path: PROFILE_PATHS.SERVICE_HISTORY_INFORMATION,
  },
  {
    name: PROFILE_PATH_NAMES.FINANCIAL_INFORMATION,
    path: PROFILE_PATHS.FINANCIAL_INFORMATION,
  },
  {
    name: PROFILE_PATH_NAMES.DIRECT_DEPOSIT,
    path: PROFILE_PATHS.DIRECT_DEPOSIT,
  },
  {
    name: PROFILE_PATH_NAMES.HEALTH_CARE_SETTINGS,
    path: PROFILE_PATHS.HEALTH_CARE_SETTINGS,
  },
  {
    name: PROFILE_PATH_NAMES.SCHEDULING_PREFERENCES,
    path: PROFILE_PATHS.SCHEDULING_PREFERENCES,
  },
  {
    name: PROFILE_PATH_NAMES.HEALTH_CARE_CONTACTS,
    path: PROFILE_PATHS.HEALTH_CARE_CONTACTS,
  },
  {
    name: PROFILE_PATH_NAMES.MESSAGES_SIGNATURE,
    path: PROFILE_PATHS.MESSAGES_SIGNATURE,
  },
  {
    name: PROFILE_PATH_NAMES.DEPENDENTS_AND_CONTACTS,
    path: PROFILE_PATHS.DEPENDENTS_AND_CONTACTS,
  },
  {
    name: PROFILE_PATH_NAMES.ACCREDITED_REPRESENTATIVE,
    path: PROFILE_PATHS.ACCREDITED_REPRESENTATIVE,
  },
  {
    name: PROFILE_PATH_NAMES.LETTERS_AND_DOCUMENTS,
    path: PROFILE_PATHS.LETTERS_AND_DOCUMENTS,
  },
  {
    name: PROFILE_PATH_NAMES.VETERAN_STATUS_CARD,
    path: PROFILE_PATHS.VETERAN_STATUS_CARD,
  },
  {
    name: PROFILE_PATH_NAMES.EMAIL_AND_TEXT_NOTIFICATIONS,
    path: PROFILE_PATHS.EMAIL_AND_TEXT_NOTIFICATIONS,
  },
  {
    name: PROFILE_PATH_NAMES.ACCOUNT_SECURITY,
    path: PROFILE_PATHS.ACCOUNT_SECURITY,
  },
  {
    name: PROFILE_PATH_NAMES.CONNECTED_APPLICATIONS,
    path: PROFILE_PATHS.CONNECTED_APPLICATIONS,
  },
  {
    name: PROFILE_PATH_NAMES.SIGNIN_INFORMATION,
    path: PROFILE_PATHS.SIGNIN_INFORMATION,
  },
];

describe('Profile Breadcrumbs', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('/v0/profile/service_history', serviceHistory);
    cy.intercept('/v0/profile/full_name', fullName);
    cy.intercept('/v0/profile/personal_information', error500);
    cy.intercept('/v0/mhv_account', error500);
    cy.intercept(
      '/v0/disability_compensation_form/rating_info',
      disabilityRating,
    );
  });

  const skippedPageTitles = [
    PROFILE_PATH_NAMES.EDIT,
    PROFILE_PATH_NAMES.EMAIL_AND_TEXT_NOTIFICATIONS,
    PROFILE_PATH_NAMES.SERVICE_HISTORY_INFORMATION,
    PROFILE_PATH_NAMES.ACCREDITED_REPRESENTATIVE,
  ];

  routes.forEach(({ path, name }) => {
    // skip the edit path
    if (skippedPageTitles.includes(name)) {
      return;
    }
    it('render the active page name in the breadcrumbs', () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          representativeStatusEnableV2Features: true,
          profile2Enabled: true,
          profileHealthCareSettingsPage: true,
          profileHideHealthCareContacts: false,
        }),
      ).as('featureToggles');
      cy.visit(path);
      cy.get('va-breadcrumbs')
        .shadow()
        .findByText(name)
        .should('exist');

      cy.url().should('eq', `${Cypress.config('baseUrl')}${path}`);
      cy.injectAxeThenAxeCheck();
    });
  });
});
