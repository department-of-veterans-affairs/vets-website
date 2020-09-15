import { Given, Then, And } from 'cypress-cucumber-preprocessor/steps';

Given('I am on the facility locator', () => {
  cy.visit('/find-locations');
});

Then('the Facility type field displays the default {string}', optionDefault => {
  cy.findByText(optionDefault, { selector: 'option' }).should('exist');
});

And(
  'the Facility type drop down contains VA and Community care options',
  () => {
    const options = [
      'VA health',
      'Urgent care',
      'Community pharmacies (in VA’s network)',
      'VA cemeteries',
      'Vet Centers',
      'VA health',
      'Community providers (in VA’s network)',
      'VA cemeteries',
      'VA benefits',
    ];
    options.forEach(option =>
      cy.findByText(option, { selector: 'option' }).should('exist'),
    );
  },
);

And(
  'location information must be entered or enabled through browser before search can be initiated',
  () => {
    cy.get('#facility-search').click();
    cy.get('#street-city-state-zip').should('have.attr', 'required');
  },
);

And('facility type must be selected before search can be initiated', () => {
  cy.get('#facility-search').click();
  cy.get('#facility-type-dropdown').should('have.attr', 'required');
});
