import Timeouts from 'platform/testing/e2e/timeouts';

const titles = {
  default: {
    en: 'We couldn’t check you in',
    es: 'No pudimos completar el registro',
    tl: 'Hindi ka namin mai-check in',
  },
  uuidNotFound: {
    en: 'This link has expired',
  },
};

const errorMessages = {
  default: {
    en:
      'We’re sorry. Something went wrong on our end. Check in with a staff member.',
    es:
      'Lo sentimos. Algo no funcionó de nuestra parte. Regístrese con un miembro del personal.',
    tl:
      'Paumanhin. May nangyaring mali sa aming panig. Mag-check in sa isang staff member.',
  },
  maxValidation: {
    en:
      'We’re sorry. We couldn’t match your information to our records. Please ask a staff member for help.',
    es:
      'Lo sentimos. No encontramos información en nuestros archivos que corresponda a esta información. Pídale asistencia a un miembro del personal.',
    tl:
      'Paumanhin. Hindi namin maitugma ang iyong impormasyon sa aming mga rekord. Mangyaring humingi ng tulong sa isang staff member.',
  },
  uuidNotFound: {
    en: 'Trying to check in for an appointment? Text check in to .',
  },
  checkInFailedCantFile: {
    en:
      'We’re sorry. We can’t file this type of travel reimbursement claim for you now. But you can still file within 30 days of the appointment.Find out how to file for travel reimbursement',
  },
  checkInFailedFindOut: {
    en:
      'VA travel pay reimbursement pays eligible Veterans and caregivers back for mileage and other travel expenses to and from approved health care appointments.Find out if you’re eligible and how to file for travel reimbursement',
  },
  checkInFailedFileLater: {
    en:
      'We’re sorry. We can’t file a travel reimbursement claim for you now. But you can still file within 30 days of the appointment.Find out how to file for travel reimbursement',
  },
};
class Error {
  validatePageLoaded = (errorType = false, language = 'en') => {
    switch (errorType) {
      case 'max-validation':
        cy.get('h1', { timeout: Timeouts.slow })
          .should('be.visible')
          .and('have.text', titles.default[language]);
        cy.get('[data-testid="error-message-0"]', { timeout: Timeouts.slow })
          .should('be.visible')
          .and('have.text', errorMessages.maxValidation[language]);
        break;
      case 'uuid-not-found':
        cy.get('h1', { timeout: Timeouts.slow })
          .should('be.visible')
          .and('have.text', titles.uuidNotFound[language]);
        cy.get('[data-testid="error-message-0"]', { timeout: Timeouts.slow })
          .should('be.visible')
          .and('have.text', errorMessages.uuidNotFound[language]);
        break;
      case 'check-in-failed-find-out':
        cy.get('h1', { timeout: Timeouts.slow })
          .should('be.visible')
          .and('have.text', titles.default[language]);
        cy.get('[data-testid="error-message-0"]', { timeout: Timeouts.slow })
          .should('be.visible')
          .and('have.text', errorMessages.default[language]);
        cy.get('[data-testid="error-message-1"]', { timeout: Timeouts.slow })
          .should('be.visible')
          .and('have.text', errorMessages.checkInFailedFindOut[language]);
        break;
      case 'check-in-failed-cant-file':
        cy.get('h1', { timeout: Timeouts.slow })
          .should('be.visible')
          .and('have.text', titles.default[language]);
        cy.get('[data-testid="error-message-0"]', { timeout: Timeouts.slow })
          .should('be.visible')
          .and('have.text', errorMessages.default[language]);
        cy.get('[data-testid="error-message-1"]', { timeout: Timeouts.slow })
          .should('be.visible')
          .and('have.text', errorMessages.checkInFailedCantFile[language]);
        break;
      case 'check-in-failed-file-later':
        cy.get('h1', { timeout: Timeouts.slow })
          .should('be.visible')
          .and('have.text', titles.default[language]);
        cy.get('[data-testid="error-message-0"]', { timeout: Timeouts.slow })
          .should('be.visible')
          .and('have.text', errorMessages.default[language]);
        cy.get('[data-testid="error-message-1"]', { timeout: Timeouts.slow })
          .should('be.visible')
          .and('have.text', errorMessages.checkInFailedFileLater[language]);
        break;
      default:
        cy.get('h1', { timeout: Timeouts.slow })
          .should('be.visible')
          .and('have.text', titles.default[language]);
        cy.get('[data-testid="error-message-0"]', { timeout: Timeouts.slow })
          .should('be.visible')
          .and('have.text', errorMessages.default[language]);
        break;
    }
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
