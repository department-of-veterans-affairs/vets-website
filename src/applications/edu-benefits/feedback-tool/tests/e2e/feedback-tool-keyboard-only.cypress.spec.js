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

    vaosSetup();

    cy.visit(manifest.rootUrl);
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

    // To be continued...
  });
});
