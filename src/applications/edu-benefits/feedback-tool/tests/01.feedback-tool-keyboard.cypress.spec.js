import manifest from '../manifest.json';

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
    cy.allyEvaluateRadioButtons(
      [
        'input#root_onBehalfOf_0',
        'input#root_onBehalfOf_1',
        'input#root_onBehalfOf_2',
      ],
      'ArrowUp',
      true,
    );

    cy.get('input#root_onBehalfOf_0').should('be.focused');
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
      '#root_serviceDateRange_fromMonth',
      'jan',
      'January',
    );
    cy.realPress('Tab');
    cy.allyEvaluateSelectMenu('#root_serviceDateRange_fromDay', '15', '15');
    cy.realPress('Tab');
    cy.allyEvaluateInput('#root_serviceDateRange_fromYear', '1990');

    cy.realPress('Tab');
    cy.allyEvaluateSelectMenu('#root_serviceDateRange_toMonth', 'mar', 'March');
    cy.realPress('Tab');
    cy.allyEvaluateSelectMenu('#root_serviceDateRange_toDay', '31', '31');
    cy.realPress('Tab');
    cy.allyEvaluateInput('#root_serviceDateRange_toYear', '2010');

    cy.repeatKey('Tab', 2);
    cy.realPress('Enter');

    cy.get('select[name="root_address_country"]');
    cy.repeatKey('Tab', 2);
    cy.allyEvaluateInput('#root_address_street', '11233 Nowhere St');

    cy.repeatKey('Tab', 2);
    cy.allyEvaluateInput('#root_address_city', 'Long Beach');

    cy.realPress('Tab');
    cy.allyEvaluateSelectMenu('#root_address_state', 'cali', 'California');

    cy.realPress('Tab');
    cy.allyEvaluateInput('#root_address_postalCode', '90712');

    cy.realPress('Tab');
    cy.allyEvaluateInput('#root_applicantEmail', 'test@test.com');

    cy.realPress('Tab');
    cy.allyEvaluateInput(
      '[name*="applicantEmailConfirmation"]',
      'test@test.com',
    );

    cy.repeatKey('Tab', 3);
    cy.realPress('Enter');

    cy.get('input[name="root_educationDetails_programs_chapter33"]').should(
      'exist',
    );
    cy.realPress('Tab');
    cy.allyEvaluateCheckboxes([
      '#root_educationDetails_programs_chapter33',
      '#root_educationDetails_programs_chapter30',
    ]);

    cy.repeatKey('Tab', 2);
    cy.realPress('Enter');

    cy.get('input[type="checkbox"]').should('exist');
    cy.repeatKey('Tab', 4);
    cy.allyEvaluateCheckboxes(['input[type="checkbox"]']);
    cy.realPress('Space');

    cy.realPress('Tab');
    cy.allyEvaluateInput('[name*="manualSchoolEntry_name"]', 'Long Beach Poly');

    cy.repeatKey('Tab', 2);
    cy.allyEvaluateInput(
      '[name*="manualSchoolEntry_address_street"]',
      '123 LaBrea Blvd',
    );

    cy.repeatKey('Tab', 3);
    cy.allyEvaluateInput(
      '[name*="manualSchoolEntry_address_city"]',
      'Los Angeles',
    );

    cy.realPress('Tab');
    cy.allyEvaluateSelectMenu(
      '[name*="manualSchoolEntry_address_state"]',
      'cali',
      'California',
    );

    cy.realPress('Tab');
    cy.allyEvaluateInput(
      '[name*="manualSchoolEntry_address_postalCode"]',
      '90001',
    );

    cy.repeatKey('Tab', 2);
    cy.realPress('Enter');

    cy.get('legend#root_issue-label').should('exist');
    cy.realPress('Tab');
    cy.allyEvaluateCheckboxes(['#root_issue_recruiting']);
    cy.repeatKey('Tab', 11);

    cy.realPress('Tab');
    cy.allyEvaluateInput(
      '#root_issueDescription',
      'Decent recruiting practices',
    );

    cy.realPress('Tab');
    cy.allyEvaluateInput(
      '#root_issueResolution',
      'Follow up on my remaining tuition and fees',
    );

    cy.repeatKey('Tab', 2);
    cy.realPress('Enter');

    cy.get('input[type="checkbox"]');
    cy.repeatKey('Tab', 7);
    cy.allyEvaluateCheckboxes(['input[type="checkbox"]']);
  });
});
