import Timeouts from 'platform/testing/e2e/timeouts';

const messages = {
  messageText: {
    en:
      'We’re sorry. Something went wrong on our end. Check in with a staff member.',
    es:
      'Lo sentimos. Algo no funcionó de nuestra parte. Regístrese con un miembro del personal.',
  },
  messageTextLastValidateAttempt: {
    en:
      'We’re sorry. We couldn’t match your information to our records. Please ask a staff member for help.',
    es:
      'Lo sentimos. No encontramos información en nuestros archivos que corresponda a esta información. Pídale asistencia a un miembro del personal.',
  },
  couldntCheckIn: {
    en: 'We couldn’t check you in',
    es: 'No pudimos completar el registro.',
  },
};
class Error {
  validatePageLoaded = (lastValidateAttempt = false, language = 'en') => {
    const messageText = lastValidateAttempt
      ? messages.messageTextLastValidateAttempt[language]
      : messages.messageText[language];
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', messages.couldntCheckIn[language]);
    cy.get('[data-testid="error-message"]', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', messageText);
  };

  validateDatePreCheckInDateShows = () => {
    cy.get('[data-testid="error-message"]', { timeout: Timeouts.slow })
      .should('be.visible')
      .contains('You can pre-check in online until');
  };

  validateURL = () => {
    cy.url().should('match', /error/);
  };
}

export default new Error();
