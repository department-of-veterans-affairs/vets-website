import mockSession from '../../../../api/local-mock-api/mocks/v1/sessions.responses';

describe('Check In Experience -- ', () => {
  describe('phase 2 -- ', () => {
    beforeEach(function() {
      cy.intercept('GET', '/check_in/v1/sessions/*', req => {
        req.reply(
          mockSession.createMockSuccessResponse('some-token', 'read.basic'),
        );
      });
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('validation failed', () => {
      const featureRoute =
        '/health-care/appointment-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287';
      cy.visit(featureRoute);
      cy.get('h1').contains('Check in at VA');
      cy.get('[label="Your last name"]')
        .should('have.attr', 'autocorrect', 'false')
        .should('have.attr', 'spellcheck', 'false');
    });
  });
});
