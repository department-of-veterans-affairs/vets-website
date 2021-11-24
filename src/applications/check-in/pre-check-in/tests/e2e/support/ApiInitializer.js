import mockSession from '../../../api/local-mock-api/mocks/v2/sessions.responses';

class ApiInitializer {
  initializeSessionGet = {
    withSuccessfulNewSession: () => {
      cy.intercept('GET', '/check_in/v2/sessions/*', req => {
        req.reply(
          mockSession.createMockSuccessResponse('some-token', 'read.basic'),
        );
      });
    },
    withSuccessfulReturningSession: () => {
      cy.intercept('GET', '/check_in/v2/sessions/*', req => {
        req.reply(
          mockSession.createMockSuccessResponse('some-token', 'read.full'),
        );
      });
    },
    withFailure: (errorCode = 400) => {
      cy.intercept('GET', '/check_in/v2/sessions/*', req => {
        req.reply(errorCode, mockSession.createMockFailedResponse());
      });
    },
  };

  initializeSessionPost = {
    withSuccess: () => {
      cy.intercept('POST', '/check_in/v2/sessions', req => {
        req.reply(
          mockSession.createMockSuccessResponse('some-token', 'read.full'),
        );
      });
    },
    withTrimCheck: (lastName = 'Smith', last4 = '1234') => {
      cy.intercept('POST', '/check_in/v2/sessions', req => {
        expect(req.body.session.lastName).to.equal(lastName);
        expect(req.body.session.last4).to.equal(last4);

        req.reply(
          mockSession.createMockSuccessResponse('some-token', 'read.full'),
        );
      });
    },
    withFailure: (errorCode = 400) => {
      cy.intercept('POST', '/check_in/v2/sessions', req => {
        req.reply(errorCode, mockSession.createMockFailedResponse());
      });
    },
  };
}

export default new ApiInitializer();
