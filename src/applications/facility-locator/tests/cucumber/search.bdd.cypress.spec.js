import { Given, When, And, Then } from 'cypress-cucumber-preprocessor/steps';

Given('I am on the facility locator', () => {
  cy.viewport(1100, 700);
  cy.visit('https://staging.va.gov/find-locations');
});

When('I fill the search input with {string} as the location', location => {
  cy.get('#street-city-state-zip').type(location);
});

And('I click on the search button', () => {
  cy.get('#facility-search').click();
});

Then('I see Results for "VA health" near  "New York, New York"', () => {
  cy.get('#facility-search-results').should('exist');
  cy.get('.facility-result:first')
    .find('.vads-u-margin-bottom--1')
    .contains('VA health');
});

And('I select the first one on the list', () => {
  cy.get('.facility-result:first')
    .find('a:first')
    .click();
});

Then('I can see basic information about the facility', () => {
  // Check this there is facility title
  cy.get('h1').should('exist');
  // Check this there a phone number
  cy.get('.facility-phone-group').should('exist');
  // Check this there a map
  cy.get('h3.highlight:first')
    .eq(0)
    .contains('View on map');
  // Check there is hours of operation
  cy.get('h3.highlight')
    .eq(1)
    .contains('Hours of operation');
});

When('I select {string} from the facilities options', location => {
  cy.get('#facility-type-dropdown').select(location);
});

Then('I see Results for "VA benefits" near  "Austin, Texas 78717"', () => {
  cy.get('#facility-search-results').should('exist');
  cy.get('.facility-result:first')
    .find('.vads-u-margin-bottom--1')
    .contains('Benefits');
});

Then(
  'I see Results for "VA cemeteries" near  "Washington, District of Columbia',
  () => {
    cy.get('#facility-search-results').should('exist');
    cy.get('.facility-result:first').find('.vads-u-margin-bottom--1');
  },
);

Then('I see Results for "Vet Centers" near  "78717"', () => {
  cy.get('#facility-search-results').should('exist');
  cy.get('.facility-result:first')
    .find('.vads-u-margin-bottom--1')
    .contains('Vet Centers');
});

Then('I can see some information', () => {
  // Check this there is facility title
  cy.get('h1').should('exist');
  // Check this there a map
  cy.get('h3.highlight:first')
    .eq(0)
    .contains('View on map');
  // Check there is hours of operation
  cy.get('h3.highlight')
    .eq(1)
    .contains('Hours of operation');
});
