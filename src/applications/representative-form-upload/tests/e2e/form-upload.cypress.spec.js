import user from './fixtures/mocks/user.json';
import mockScannedFormUpload from './fixtures/mocks/scanned-form-upload.json';
import { setFeatureToggles } from './intercepts/features-toggles';

const mockSubmit = JSON.stringify({
  // eslint-disable-next-line camelcase
  confirmation_number: '48fac28c-b332-4549-a45b-3423297111f4',
});

Cypress.Commands.add('loginArpUser', () => {
  cy.intercept('GET', '/accredited_representative_portal/v0/user', {
    statusCode: 200,
    body: user,
  }).as('fetchUser');
});

Cypress.Commands.add('denyArpUser', () => {
  cy.intercept('GET', '/accredited_representative_portal/v0/user', {
    statusCode: 401,
    body: user,
  }).as('denyUser');
});

const vamcUser = {
  data: {
    nodeQuery: {
      count: 0,
      entities: [],
    },
  },
};

const setUpIntercepts = featureToggles => {
  cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcUser).as('vamcUser');
  setFeatureToggles(featureToggles);
};

describe('Representative Form Upload', () => {
  describe('Authorized VSO Rep', () => {
    beforeEach(() => {
      cy.loginArpUser();
      setUpIntercepts({
        isAppEnabled: true,
        isInPilot: true,
      });
      cy.intercept(
        'POST',
        '/accredited_representative_portal/v0/representative_form_upload',
        mockScannedFormUpload,
      );
      cy.intercept(
        'POST',
        '/accredited_representative_portal/v0/submit_representative_form',
        mockSubmit,
      );
    });
  });

  describe('Unauthorized VSO Rep', () => {
    it('should not allow access to the form upload page', () => {
      cy.denyArpUser();
      setUpIntercepts({
        isAppEnabled: true,
        isInPilot: true,
      });
      cy.visit('/representative/representative-form-upload/21-686c/');
      cy.location('pathname').should('eq', '/sign-in/');
    });
  });
});
