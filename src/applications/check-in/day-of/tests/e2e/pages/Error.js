import Timeouts from 'platform/testing/e2e/timeouts';

const titles = {
  default: {
    en: 'We couldn’t check you in',
    es: 'No pudimos completar el registro.',
    tl: 'Hindi ka namin mai-check in',
  },
  uuidNotFound: {
    en: 'We’re sorry. This link has expired.',
    es: '',
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
    es: 'Lo sentimos',
    tl: 'Paumanhin.',
  },
};
class Error {
  validatePageLoaded = (errorType = false, language = 'en') => {
    let messageText = '';
    let titleText = '';
    switch (errorType) {
      case 'max-validation':
        titleText = titles.default[language];
        messageText = errorMessages.maxValidation[language];
        break;
      case 'uuid-not-found':
        titleText = titles.uuidNotFound[language];
        messageText = errorMessages.uuidNotFound[language];
        break;
      default:
        titleText = titles.default[language];
        messageText = errorMessages.default[language];
        break;
    }
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', titleText);
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
