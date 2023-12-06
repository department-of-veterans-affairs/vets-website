import { PROFILE_PATHS } from '@@profile/constants';
import { mockUser } from '@@profile/tests/fixtures/users/user';
import mockServiceHistory from '@@profile/tests/fixtures/service-history-success.json';
import mockFullNameSucess from '@@profile/tests/fixtures/full-name-success.json';
import mockPersonalInformationEnhanced from '@@profile/tests/fixtures/personal-information-success-enhanced.json';
import mockPersonalInformation from '@@profile/tests/fixtures/personal-information-success.json';
import mockProfileEnhancementsToggles from '@@profile/tests/fixtures/personal-information-feature-toggles.json';
import mockDisabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';

export const setup = (
  options = {
    personalInfo: null,
    isEnhanced: false,
    fullNameMockResponse: null,
    disabilityRatingMockResponse: null,
    customMockUser: null,
  },
) => {
  cy.login(options?.customMockUser || mockUser);

  cy.intercept(
    'GET',
    'v0/profile/personal_information',
    options.personalInfo ||
      (options.isEnhanced
        ? mockPersonalInformationEnhanced
        : mockPersonalInformation),
  );
  cy.intercept('v0/profile/service_history', mockServiceHistory);

  cy.intercept(
    'v0/profile/full_name',
    options.fullNameMockResponse || mockFullNameSucess,
  );

  cy.intercept(
    'v0/disability_compensation_form/rating_info',
    options?.disabilityRatingMockResponse || mockDisabilityRating,
  );

  cy.intercept('v0/feature_toggles*', mockProfileEnhancementsToggles);

  cy.visit(PROFILE_PATHS.PERSONAL_INFORMATION);
};
