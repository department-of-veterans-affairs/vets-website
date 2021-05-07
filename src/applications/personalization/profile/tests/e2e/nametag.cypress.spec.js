import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import error401 from '@@profile/tests/fixtures/401.json';
import error403 from '@@profile/tests/fixtures/403.json';
import error500 from '@@profile/tests/fixtures/500.json';

import { mockUser } from '../fixtures/users/user';
import {
  mockFeatureToggles,
  nameTagRendersWithDisabilityRating,
  nameTagRendersWithFallbackLink,
  nameTagRendersWithoutDisabilityRating,
} from './helpers';
import { PROFILE_PATHS } from '../../constants';

describe('Profile NameTag', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('/v0/profile/service_history', serviceHistory);
    cy.intercept('/v0/profile/full_name', fullName);
    // Explicitly mocking these APIs as failures, causes the tests to run MUCH
    // faster. All three tests run in 2-3s instead of 8-9s.
    cy.intercept('/v0/profile/personal_information', error500);
    cy.intercept('/v0/mhv_account', error500);
  });
  context('when it can load the disability rating', () => {
    beforeEach(() => {
      cy.intercept(
        '/v0/disability_compensation_form/rating_info',
        disabilityRating,
      );
    });
    it('should render the name, service branch, and disability rating', () => {
      mockFeatureToggles();
      cy.visit(PROFILE_PATHS.PROFILE_ROOT);
      nameTagRendersWithDisabilityRating();
    });
  });
  context('when there is a 401 fetching the disability rating', () => {
    beforeEach(() => {
      cy.intercept('/v0/disability_compensation_form/rating_info', {
        statusCode: 401,
        body: error401,
      });
    });
    it('should render the name, service branch, and not show disability rating', () => {
      mockFeatureToggles();
      cy.visit(PROFILE_PATHS.PROFILE_ROOT);
      nameTagRendersWithoutDisabilityRating();
    });
  });
  context('when there is a 403 fetching the disability rating', () => {
    beforeEach(() => {
      cy.intercept('/v0/disability_compensation_form/rating_info', {
        statusCode: 403,
        body: error403,
      });
    });
    it('should render the name, service branch, and not show disability rating', () => {
      mockFeatureToggles();
      cy.visit(PROFILE_PATHS.PROFILE_ROOT);
      nameTagRendersWithoutDisabilityRating();
    });
  });
  context('when there is a 500 fetching the disability rating', () => {
    beforeEach(() => {
      cy.intercept('/v0/disability_compensation_form/rating_info', {
        statusCode: 500,
        body: error500,
      });
    });
    it('should render the name, service branch, and show a fallback link for disability rating', () => {
      mockFeatureToggles();
      cy.visit(PROFILE_PATHS.PROFILE_ROOT);
      nameTagRendersWithFallbackLink();
    });
  });
});
