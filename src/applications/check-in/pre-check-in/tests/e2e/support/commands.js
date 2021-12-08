const defaultUUID = '0429dda5-4165-46be-9ed1-1e652a8dfd83';

Cypress.Commands.add('visitPreCheckInWithUUID', (uuid = defaultUUID) => {
  cy.visit(`/health-care/appointment-pre-check-in/?id=${uuid}`);
});
