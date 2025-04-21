import manifest from '../../manifest.json';

export function vaosSetup() {
  Cypress.Commands.add('axeCheckBestPractice', (context = 'main') => {
    cy.axeCheck(context, {
      runOnly: {
        type: 'tag',
        values: [
          'section508',
          'wcag2a',
          'wcag2aa',
          'wcag21a',
          'wcag21aa',
          'best-practice',
        ],
      },
    });
  });
}
describe('Feedback Tool Keyboard Test', () => {
  it('Is accessible accordingly via keyboard', () => {
    cy.intercept('POST', '/v0/gi_bill_feedbacks', {
      data: {
        attributes: {
          guid: '1234',
          submittedAt: '2016-05-16',
        },
      },
    });

    cy.visit(manifest.rootUrl);
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
        'link-name': {
          enabled: false,
        },
      },
    });
    cy.get('body').should('be.visible');
    cy.get('.schemaform-title').should('be.visible');
    cy.get('.schemaform-start-button')
      .first()
      .click();

    cy.url().should('not.include', '/introduction');

    cy.realPress('Tab');
    cy.get('va-radio-option[value="Myself"]').click();
    cy.get('input#root_anonymousEmail').should('not.exist');

    cy.repeatKey('Tab', 2);
    cy.realPress('Enter');

    cy.get('input[name="root_fullName_first"]').should('be.visible');
    cy.realPress('Tab');
    cy.allyEvaluateSelectMenu('#root_fullName_prefix', 'dr', 'Dr.');

    cy.realPress('Tab');
    cy.allyEvaluateInput('#root_fullName_first', 'Benjamin');

    cy.repeatKey('Tab', 2);
    cy.allyEvaluateInput('#root_fullName_last', 'Rhodes');

    cy.repeatKey('Tab', 2);
    cy.allyEvaluateSelectMenu('#root_serviceAffiliation', 'Veteran', 'Veteran');

    cy.repeatKey('Tab', 2);
    cy.realPress('Enter');

    cy.get('#root_serviceBranch');
    cy.realPress('Tab');
    cy.allyEvaluateSelectMenu('#root_serviceBranch', 'army', 'Army');

    cy.realPress('Tab');
    cy.allyEvaluateSelectMenu(
      '[name="root_serviceDateRange_fromMonth"]',
      'jan',
      'January',
    );
    cy.realPress('Tab');
    cy.allyEvaluateInput('[name="root_serviceDateRange_fromDay"]', '15', '15');
    cy.realPress('Tab');
    cy.allyEvaluateInput(
      '[name="root_serviceDateRange_fromYear"]',
      '1990',
      '1990',
    );
    cy.realPress('Tab');
    cy.allyEvaluateSelectMenu(
      '[name="root_serviceDateRange_toMonth"]',
      'mar',
      'March',
    );
    cy.realPress('Tab');
    cy.allyEvaluateInput('[name="root_serviceDateRange_toDay"]', '31', '31');
    cy.realPress('Tab');
    cy.allyEvaluateInput(
      '[name="root_serviceDateRange_toYear"]',
      '2010',
      '2010',
    );
    cy.repeatKey('Tab', 2);
    cy.realPress('Enter');
    cy.url().should('not.include', '/service-information');
    cy.url().should('include', '/contact-information');
    cy.get('[name="root_address_country"]').select('United States');
    cy.repeatKey('Tab', 1);
    cy.allyEvaluateInput('#root_address_street', '11233 Nowhere St');
    cy.repeatKey('Tab', 2);
    cy.allyEvaluateInput('#root_address_city', 'Long Beach');
    cy.repeatKey('Tab', 2);
    cy.get('[name="root_address_state"]').select('CA');
    cy.realPress('Tab');
    cy.allyEvaluateInput('#root_address_postalCode', '90712');
    cy.realPress('Tab');
    cy.allyEvaluateInput('#root_applicantEmail', 'test@va.gov');
    cy.realPress('Tab');
    cy.get('[name="root_view:applicantEmailConfirmation"]').type('test@va.gov');
    cy.repeatKey('Tab', 3);
    cy.realPress('Enter');
    cy.url().should('not.include', '/contact-information');
    cy.url().should('include', '/benefits-information');
    cy.get('input[name="root_educationDetails_programs_chapter33"]').check();
    cy.get('input[name="root_educationDetails_programs_chapter30"]').check();
    cy.get('input[name="root_educationDetails_programs_chapter31"]').check();
    cy.repeatKey('Tab', 6);
    cy.realPress('Enter');
    cy.url().should('not.include', '/benefits-information');
    cy.url().should('include', '/school-information');
    cy.get('input[name="school-search-input"]')
      .should('exist')
      .type('foothill high');
    cy.realPress('Tab');
    cy.realPress('Enter');
    cy.repeatKey('Tab', 3);
  });
});
