import checkInData from '../../../api/local-mock-api/mocks/v2/check-in-data';
import preCheckInData from '../../../api/local-mock-api/mocks/v2/pre-check-in-data';

const checkInUUID = checkInData.get.defaultUUID;

Cypress.Commands.add('visitWithUUID', (uuid = checkInUUID, language = 'en') => {
  cy.visit(`/health-care/appointment-check-in/?id=${uuid}`, {
    onBeforeLoad(win) {
      Object.defineProperty(win.navigator, 'language', {
        value: `${language}-US`,
      });
      Object.defineProperty(win.navigator, 'languages', { value: [language] });
      Object.defineProperty(win.navigator, 'accept_languages', {
        value: [language],
      });
    },
    headers: {
      'Accept-Language': language,
    },
  });
});

const preCheckInUUID = preCheckInData.get.defaultUUID;

Cypress.Commands.add('visitPreCheckInWithUUID', (uuid = preCheckInUUID) => {
  cy.visit(`/health-care/appointment-pre-check-in/?id=${uuid}`);
});
