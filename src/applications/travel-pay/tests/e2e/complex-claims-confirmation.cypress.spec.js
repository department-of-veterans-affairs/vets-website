/* eslint-disable @department-of-veterans-affairs/axe-check-required */
import { rootUrl } from '../../manifest.json';
import user from '../fixtures/user.json';
import ApiInitializer from './utilities/ApiInitializer';

describe('Complex Claims Confirmation Page', () => {
  const appointmentId = '12345';
  const claimId = '45678';

  beforeEach(() => {
    cy.clock(new Date(2025, 0, 15), ['Date']);
    cy.intercept('/data/cms/vamc-ehr.json', {});
    ApiInitializer.initializeFeatureToggle.withAllFeatures();
    ApiInitializer.initializeAppointment.happyPath();
    cy.login(user);
  });

  afterEach(() => {
    cy.clock().invoke('restore');
  });

  it('displays confirmation page with success alert', () => {
    cy.visit(
      `${rootUrl}/file-new-claim/${appointmentId}/${claimId}/confirmation`,
    );
    cy.injectAxeThenAxeCheck();

    // Check main heading
    cy.get('h1').should(
      'contain.text',
      `We’re processing your travel reimbursement claim`,
    );

    // Check success alert
    cy.get('va-alert[status="success"]').should('be.visible');
    cy.get('va-alert[status="success"]')
      .find('[slot="headline"]')
      .should('contain.text', 'Claim submitted');

    // Check claim number placeholder
    cy.get('va-alert[status="success"]').should(
      'contain.text',
      'Claim number: #######',
    );
  });

  it('displays appointment details in success alert', () => {
    cy.visit(
      `${rootUrl}/file-new-claim/${appointmentId}/${claimId}/confirmation`,
    );

    // Check appointment details in the success alert
    cy.get('va-alert[status="success"]').should(
      'contain.text',
      'This claim is for your appointment at Fort Collins VA Clinic',
    );
  });

  it('has functional print button', () => {
    cy.visit(
      `${rootUrl}/file-new-claim/${appointmentId}/${claimId}/confirmation`,
    );

    // Check print section
    cy.get('h2').should('contain.text', 'Print this confirmation page');
    cy.get('va-button[text="Print this page for your records"]').should(
      'be.visible',
    );

    // Mock window.print to verify it gets called
    cy.window().then(win => {
      cy.stub(win, 'print').as('windowPrint');
    });

    cy.get('va-button[text="Print this page for your records"]').click();
    cy.get('@windowPrint').should('have.been.called');
  });

  it('displays what happens next section with process list', () => {
    cy.visit(
      `${rootUrl}/file-new-claim/${appointmentId}/${claimId}/confirmation`,
    );

    // Check "What happens next" section
    cy.get('h2').should('contain.text', 'What happens next');
    cy.get('va-process-list').should('be.visible');

    // Check first process item
    cy.get('va-process-list-item[header="VA will review your claim"]').should(
      'be.visible',
    );
    cy.get('va-process-list-item[header="VA will review your claim"]').should(
      'contain.text',
      'You can check the status of this claim',
    );

    // Check second process item
    cy.get(
      'va-process-list-item[header*="receive reimbursement via direct deposit"]',
    ).should('be.visible');
    cy.get(
      'va-process-list-item[header*="receive reimbursement via direct deposit"]',
    ).should('contain.text', 'You must have direct deposit set up');

    // Check travel pay claims status link
    cy.get(
      'va-link[href="/my-health/travel-pay/claims/"][text="Check your travel reimbursement claim status"]',
    ).should('be.visible');

    // Check direct deposit setup link
    cy.get(
      'va-link[href="/resources/how-to-set-up-direct-deposit-for-va-travel-pay-reimbursement/"][text="Set up direct deposit"]',
    ).should('be.visible');
  });

  it('has submit another claim link action', () => {
    cy.visit(
      `${rootUrl}/file-new-claim/${appointmentId}/${claimId}/confirmation`,
    );

    // Check link action for submitting another claim
    cy.get(
      'va-link-action[text="Submit another travel reimbursement claim"][href="/my-health/appointments/past"]',
    ).should('be.visible');
  });

  it('displays contact information section', () => {
    cy.visit(
      `${rootUrl}/file-new-claim/${appointmentId}/${claimId}/confirmation`,
    );

    // Check contact section heading
    cy.get('h2').should(
      'contain.text',
      'How to contact us if you have questions',
    );

    // Check phone numbers
    cy.get('va-telephone[contact="8555747292"]').should('be.visible');
    cy.get('va-telephone[contact="711"][tty]').should('be.visible');

    // Check hours of operation
    cy.get('p').should(
      'contain.text',
      `We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET`,
    );

    // Check Ask VA link
    cy.get(
      'va-link[href="https://ask.va.gov/"][text="Contact us online through Ask VA"]',
    ).should('be.visible');
  });

  it('handles different appointment IDs in URL', () => {
    const differentApptId = '98765';
    const differentClaimId = 'claim-11111';
    cy.visit(
      `${rootUrl}/file-new-claim/${differentApptId}/${differentClaimId}/confirmation`,
    );

    // Verify back link uses the correct appointment ID
    cy.get('va-link[back][data-testid="complex-claim-back-link"]')
      .should('have.attr', 'href')
      .and('include', `/my-health/appointments/past/${differentApptId}`);
  });

  describe('responsive behavior', () => {
    it('displays correctly on mobile viewport', () => {
      cy.viewport('iphone-6');
      cy.visit(
        `${rootUrl}/file-new-claim/${appointmentId}/${claimId}/confirmation`,
      );

      // Check that content is still accessible on mobile
      cy.get('h1').should('be.visible');
      cy.get('va-alert[status="success"]').should('be.visible');
      cy.get('va-button[text="Print this page for your records"]').should(
        'be.visible',
      );
    });

    it('displays correctly on tablet viewport', () => {
      cy.viewport('ipad-2');
      cy.visit(
        `${rootUrl}/file-new-claim/${appointmentId}/${claimId}/confirmation`,
      );

      // Check layout on tablet
      cy.get('.vads-l-col--12.medium-screen\\:vads-l-col--8').should(
        'be.visible',
      );
      cy.get('va-process-list').should('be.visible');
    });
  });
});
