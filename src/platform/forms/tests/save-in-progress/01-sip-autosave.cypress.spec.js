// import moment from 'moment';
// import Timeouts from 'platform/testing/e2e/timeouts';

import mockUser from '../fixtures/mocks/mockUser';
import mock1010Get from '../fixtures/mocks/mock1010Get';
import mock1010Put from '../fixtures/mocks/mock1010Put';

describe('SIP Autosave Test', () => {
  it('fails and properly recovers', () => {
    cy.intercept('POST', '/v0/health_care_applications', {
      formSubmissionId: '123fake-submission-id-567',
      timestamp: '2016-05-16',
    });
    cy.intercept('GET', '/v0/sessions/slo/new', {
      url: 'http://fake',
    });
    cy.intercept('GET', '/v0/sessions/new', {
      url: 'http://fake',
    });
    cy.intercept('GET', '/v0/user', mockUser).as('mockUser');
    cy.intercept('GET', '/v0/in_progress_forms/1010ez', mock1010Get);
    cy.intercept('PUT', '/v0/in_progress_forms/1010ez', mock1010Put);

    cy.visit('/health-care/apply/application');
    cy.login();
    cy.get('body').should('be.visible');
  });
});
