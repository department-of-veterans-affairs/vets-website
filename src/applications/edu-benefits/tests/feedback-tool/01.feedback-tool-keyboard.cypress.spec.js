import manifest from '../../feedback-tool/manifest.json';

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
    cy.get('body').should('be.visible');
    cy.get('.schemaform-title').should('be.visible');
    cy.get('.schemaform-start-button')
      .first()
      .click();

    cy.url().should('not.include', '/introduction');

    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_onBehalfOf_0',
        'input#root_onBehalfOf_1',
        'input#root_onBehalfOf_2',
      ],
      'ArrowDown',
    );
  });
});
