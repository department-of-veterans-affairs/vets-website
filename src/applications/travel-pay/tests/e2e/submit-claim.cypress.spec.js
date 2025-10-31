/* eslint-disable @department-of-veterans-affairs/axe-check-required */
import { rootUrl } from '../../manifest.json';
import user from '../fixtures/user.json';
import ApiInitializer from './utilities/ApiInitializer';

describe('Submit Mileage Only Claims', () => {
  beforeEach(() => {
    cy.clock(new Date(2025, 0, 15), ['Date']);
    cy.intercept('/data/cms/vamc-ehr.json', {});
    ApiInitializer.initializeFeatureToggle.withSmocOnly();
    ApiInitializer.initializeAppointment.happyPath();
    cy.login(user);
    cy.visit(`${rootUrl}/file-new-claim/12345`);
    cy.wait(['@featureToggles', '@appointment']);
    cy.injectAxeThenAxeCheck();
  });

  afterEach(() => {
    cy.clock().invoke('restore');
  });

  it('defaults to the Introduction page', () => {
    cy.get('h1').should('include.text', 'File a travel reimbursement claim');
  });

  it('should handle validation and answering "No" and navigate through the flow', () => {
    ApiInitializer.submitClaim.happyPath();

    cy.get('va-link-action[text="Start a mileage-only claim"]')
      .first()
      .click();

    // Test that a No answer sends user to "Can't file this type..." page
    cy.get('h1').should('include.text', 'Are you only claiming mileage?');

    // Answer "No" and continue
    cy.get('va-radio-option[label="No"]')
      .first()
      .click();

    cy.selectVaButtonPairPrimary();

    cy.get('h1').should(
      'include.text',
      `We can’t file this claim in this tool at this time`,
    );

    cy.get('va-button[text="Back"]')
      .first()
      .click();

    cy.get('h1').should('include.text', 'Are you only claiming mileage?');

    // Answer "Yes" and continue through the rest of the flow
    cy.get('va-radio-option[label="Yes"]')
      .first()
      .click();

    cy.selectVaButtonPairPrimary();

    // Test that not selecting any answer triggers an error
    cy.get('h1').should('include.text', 'Did you travel in your own vehicle?');

    cy.selectVaButtonPairPrimary();

    cy.get('.usa-error-message').should(
      'include.text',
      'You must make a selection to continue.',
    );

    // Answer "Yes" and continue through the rest of the flow
    cy.get('va-radio-option[label="Yes"]')
      .first()
      .click();

    cy.selectVaButtonPairPrimary();

    // Address question
    cy.get('h1').should(
      'include.text',
      'Did you travel from your home address?',
    );

    // Answer "yes" and continue
    cy.get('va-radio-option[label="Yes"]')
      .first()
      .click();

    cy.selectVaButtonPairPrimary();

    // Review page
    cy.get('h1').should('include.text', 'Review your travel claim');

    // Agree to travel agreement and submit
    cy.selectVaCheckbox('accept-agreement', true);

    cy.selectVaButtonPairPrimary();

    // Happy path
    cy.get('h1').should(
      'include.text',
      `We’re processing your travel reimbursement claim`,
    );
  });

  it('should handle a failed submission', () => {
    ApiInitializer.submitClaim.errorPath();

    cy.get('va-link-action[text="Start a mileage-only claim"]')
      .first()
      .click();

    cy.get('h1').should('include.text', 'Are you only claiming mileage?');

    // Answer "Yes" and continue through the rest of the flow
    cy.get('va-radio-option[label="Yes"]')
      .first()
      .click();

    cy.selectVaButtonPairPrimary();

    cy.get('h1').should('include.text', 'Did you travel in your own vehicle?');

    // Answer "Yes" and continue through the rest of the flow
    cy.get('va-radio-option[label="Yes"]')
      .first()
      .click();

    cy.selectVaButtonPairPrimary();

    // Address question
    cy.get('h1').should(
      'include.text',
      'Did you travel from your home address?',
    );

    // Answer "yes" and continue
    cy.get('va-radio-option[label="Yes"]')
      .first()
      .click();

    cy.selectVaButtonPairPrimary();

    // Review page
    cy.get('h1').should('include.text', 'Review your travel claim');

    // Agree to travel agreement and submit
    cy.selectVaCheckbox('accept-agreement', true);

    cy.selectVaButtonPairPrimary();

    // Submission error path
    cy.get('h1').should('include.text', `We couldn’t file your claim`);
  });
});
