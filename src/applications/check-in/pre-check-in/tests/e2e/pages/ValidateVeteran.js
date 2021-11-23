import Timeouts from 'platform/testing/e2e/timeouts';
import mockSession from '../../../api/local-mock-api/mocks/v2/sessions.responses';

class ValidateVeteran {
  initializeApiWithTrimCheck(lastName = 'Smith', last4 = '1234') {
    cy.intercept('POST', '/check_in/v2/sessions', req => {
      expect(req.body.session.lastName).to.equal(lastName);
      expect(req.body.session.last4).to.equal(last4);

      req.reply(
        mockSession.createMockSuccessResponse('some-token', 'read.full'),
      );
    });
  }
  initializeApi() {
    cy.intercept('POST', '/check_in/v2/sessions', req => {
      req.reply(
        mockSession.createMockSuccessResponse('some-token', 'read.full'),
      );
    });
  }
  validatePageLoaded() {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Start pre-check-in');
  }
  validateVeteran(lastName = 'Smith', last4 = '1234') {
    cy.get('[label="Your last name"]')
      .shadow()
      .find('input')
      .type(lastName);
    cy.get('[label="Last 4 digits of your Social Security number"]')
      .shadow()
      .find('input')
      .type(last4);
  }

  attemptToGoToNextPage() {
    cy.get('[data-testid=check-in-button]').click();
  }
}

export default new ValidateVeteran();
