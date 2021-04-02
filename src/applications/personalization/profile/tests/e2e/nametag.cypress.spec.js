import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';

import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import error401 from '@@profile/tests/fixtures/401.json';
import error500 from '@@profile/tests/fixtures/500.json';

import mockUser from '../fixtures/users/user';
import { mockFeatureToggles, nameTagRenders } from './helpers';
import { PROFILE_PATHS } from '../../constants';

describe('Profile NameTag', () => {
  beforeEach(() => {
    disableFTUXModals();
    cy.login(mockUser);
    cy.intercept('/v0/profile/service_history', serviceHistory);
    cy.intercept('/v0/profile/full_name', fullName);
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
      nameTagRenders({ withDisabilityRating: true });
    });
  });
  context('when there is a 401 fetching the disability rating', () => {
    beforeEach(() => {
      cy.intercept('/v0/disability_compensation_form/rating_info', {
        statusCode: 401,
        body: error401,
      });
    });
    it('should render the name, service branch, and show a fallback link for disability rating', () => {
      mockFeatureToggles();
      cy.visit(PROFILE_PATHS.PROFILE_ROOT);
      nameTagRenders({ withDisabilityRating: false });
    });
  });
  context('when there is a 500 fetching the disability rating', () => {
    beforeEach(() => {
      cy.intercept('/v0/disability_compensation_form/rating_info', {
        statusCode: 401,
        body: error500,
      });
    });
    it('should render the name, service branch, and show a fallback link for disability rating', () => {
      mockFeatureToggles();
      cy.visit(PROFILE_PATHS.PROFILE_ROOT);
      nameTagRenders({ withDisabilityRating: false });
    });
  });
});
