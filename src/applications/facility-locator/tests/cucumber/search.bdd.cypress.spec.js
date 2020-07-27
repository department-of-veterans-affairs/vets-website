import { Given } from 'cypress-cucumber-preprocessor/steps';

Given('I am on the facility locator', () => {
  cy.visit('/find-locations');
});
