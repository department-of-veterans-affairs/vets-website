import manifest from '../../manifest.json';
import mockFeedbackPost from '../fixtures/mocks/feedback-post.json';
import mockFeedbackGet from '../fixtures/mocks/feedback-1234.json';

describe('Feedback Tool Keyboard Test', () => {
  beforeEach(function() {
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        type: 'feature_toggles',
        features: [],
      },
    });

    if (Cypress.env('CI')) {
      this.skip();
    }
  });
  it('Is accessible accordingly via keyboard', () => {
    cy.intercept('POST', '/v0/gi_bill_feedbacks', {
      statusCode: 200,
      body: mockFeedbackPost,
    }).as('postFeedback');
    cy.intercept('GET', '/v0/gi_bill_feedbacks/1234', mockFeedbackGet);
    cy.intercept('GET', '/data/cms/vamc-ehr.json', { body: {} });
    cy.visit(manifest.rootUrl);
    cy.login();
    cy.injectAxe();
    cy.axeCheck('main');

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

    cy.tabToContinueForm();

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

    cy.tabToContinueForm();
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
    cy.tabToContinueForm();
    cy.url().should('not.include', '/contact-information');
    cy.url().should('include', '/benefits-information');
    cy.get('input[name="root_educationDetails_programs_chapter33"]').check();
    cy.get('input[name="root_educationDetails_programs_chapter30"]').check();
    cy.get('input[name="root_educationDetails_programs_chapter31"]').check();
    cy.tabToContinueForm();
    cy.url().should('not.include', '/benefits-information');
    cy.url().should('include', '/school-information');
    cy.get('input[name="school-search-input"]')
      .should('exist')
      .type('foothill high');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Space');
    cy.realPress('Tab');
    cy.allyEvaluateInput('[name*="manualSchoolEntry_name"]', 'Long Beach Poly');
    cy.repeatKey('Tab', 2);
    cy.allyEvaluateInput(
      '[name*="manualSchoolEntry_address_street"]',
      '11233 Nowhere St',
    );
    cy.repeatKey('Tab', 3);
    cy.allyEvaluateInput(
      '[name="root_educationDetails_school_view:manualSchoolEntry_address_city"]',
      'Long Beach',
    );
    cy.realPress('Space');
    cy.realPress('Tab');
    cy.allyEvaluateSelectMenu(
      '[name="root_educationDetails_school_view:manualSchoolEntry_address_state"]',
      'cali',
      'California',
    );
    cy.realPress('Tab');
    cy.typeInFocused('90810');
    cy.tabToContinueForm();
    cy.url().should('not.include', '/school-information');
    cy.url().should('include', '/feedback-information');
    cy.get('input[name="root_issue_recruiting"]').check();
    cy.repeatKey('Tab', 2);
    cy.realPress('Space');
    cy.realPress('Tab');
    cy.realPress('Space');
    cy.repeatKey('Tab', 9);
    cy.typeInFocused('This is a test comment');
    cy.realPress('Tab');
    cy.typeInFocused('This is another test comment');
    cy.tabToContinueForm();
    cy.url().should('not.include', '/feedback-information');
    cy.url().should('include', '/review-and-submit');
    cy.tabToElementAndPressSpace('va-checkbox');
    cy.tabToSubmitForm();
    cy.realPress('Space');
    cy.wait('@postFeedback');
    cy.url().should(
      'include',
      '/education/submit-school-feedback/confirmation',
    );
  });
});
