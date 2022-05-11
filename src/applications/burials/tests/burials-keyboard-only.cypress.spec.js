import mockUser from './e2e/fixtures/mocks/mockUser';
import burial1234 from './e2e/fixtures/mocks/burial-1234.json';
import burialPost from './e2e/fixtures/mocks/burial-post.json';
import testData from './schema/minimal-test.json';

describe('Burials keyboard only navigation', () => {
  it('navigates through a minimal form', () => {
    const { data } = testData;
    cy.intercept('PUT', 'v0/in_progress_forms/21P-530', {});
    cy.intercept('GET', '/v0/burial_claims/1234', burial1234);
    cy.intercept('POST', '/v0/burial_claims', { body: burialPost });

    cy.login({
      data: {
        attributes: {
          ...mockUser.data.attributes,
          // eslint-disable-next-line camelcase
          in_progress_forms: [],
        },
      },
    });
    cy.visit('/burials-and-memorials/application/530');
    cy.injectAxeThenAxeCheck();

    // Intro page
    cy.tabToElement('button[id$="continueButton"]');
    cy.realPress('Space');

    // Claimant Info
    cy.typeInFullName('root_claimantFullName_', data.claimantFullName);
    cy.tabToElement('[name="root_relationship_type"]');
    cy.chooseRadio(data.relationship.type);

    // Fill in "Other" input which is revealed when the radio is selected
    if (data.relationship.type === 'other') {
      cy.typeInIfDataExists(
        '#root_relationship_other',
        data.relationship.other,
      );
      if (data.relationship['view:isEntity']) {
        cy.tabToElement('#root_relationship_isEntity');
        cy.realPress('Space');
      }
    }

    cy.tabToElement('button[type="submit"]');
    cy.realPress('Space');

    // Deceased Veteran Info
    cy.typeInFullName('root_veteranFullName_', data.veteranFullName);
    cy.typeInIfDataExists(
      '#root_veteranSocialSecurityNumber',
      data.veteranSocialSecurityNumber,
    );
    cy.typeInIfDataExists(
      '#root_vaFileNumber',
      data.veteranSocialSecurityNumber,
    );
    cy.typeInDate('root_veteranDateOfBirth', data.veteranDateOfBirth);

    // // Form submit button is a button type?
    // cy.tabToElement('button[id$="continueButton"].usa-button-primary');
    // cy.realPress('Space');

    // // Confirmation page print button
    // cy.get('button.screen-only').should('exist');
  });
});
