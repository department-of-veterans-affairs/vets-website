/* eslint-disable @department-of-veterans-affairs/axe-check-required */
import { rootUrl } from '../../manifest.json';
import user from '../fixtures/user.json';
import ApiInitializer from './utilities/ApiInitializer';
import { FIND_FACILITY_TP_CONTACT_LINK } from '../../constants';

describe('Complex Claims Confirmation Page', () => {
  const appointmentId = '12345';
  const claimId = '45678';

  beforeEach(() => {
    cy.clock(new Date(2025, 0, 15), ['Date']);
    cy.intercept('/data/cms/vamc-ehr.json', {});
    ApiInitializer.initializeFeatureToggle.withAllFeatures();
    ApiInitializer.initializeAppointment.happyPath();
    // Mock the submit call
    cy.intercept('PATCH', `/travel_pay/v0/complex_claims/${claimId}/submit`, {
      statusCode: 200,
      body: {
        data: { claimNumber: claimId },
      },
    }).as('submitClaim');

    // Mock the GET on confirmation page
    cy.intercept('GET', `/travel_pay/v0/claims/${claimId}`, {
      statusCode: 200,
      body: {
        data: {
          id: claimId,
          type: 'complex_claims',
          attributes: {
            claimNumber: claimId,
            appointmentId,
            status: 'submitted',
            createdAt: '2025-01-15T00:00:00Z',
          },
        },
      },
    }).as('claimDetails');

    cy.login(user);
  });

  afterEach(() => {
    cy.clock().invoke('restore');
  });

  it('displays confirmation page with success alert', () => {
    cy.visit(
      `${rootUrl}/file-new-claim/${appointmentId}/${claimId}/travel-agreement`,
    );

    // Agree to travel agreement and submit
    cy.selectVaCheckbox('accept-agreement', true);

    cy.get('va-button[continue]').click();

    cy.wait('@submitClaim');
    cy.wait('@claimDetails');
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
      `Claim number: ${claimId}`,
    );
  });

  it('displays appointment details in success alert', () => {
    cy.visit(
      `${rootUrl}/file-new-claim/${appointmentId}/${claimId}/travel-agreement`,
    );

    // Agree to travel agreement and submit
    cy.selectVaCheckbox('accept-agreement', true);

    cy.get('va-button[continue]').click();

    cy.wait('@submitClaim');
    cy.wait('@claimDetails');

    // Check appointment details in the success alert
    cy.get('va-alert[status="success"]').should(
      'contain.text',
      'This claim is for your appointment at Cheyenne VA Medical Center',
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
    cy.get('va-process-list-item[header="We’ll review your claim"]').should(
      'be.visible',
    );
    cy.get('va-process-list-item[header="We’ll review your claim"]').should(
      'contain.text',
      'You can check the status of this claim',
    );

    // Check second process item
    cy.get(
      'va-process-list-item[header*="If we approve your claim, we’ll deposit your funds into your bank account"]',
    ).should('be.visible');
    cy.get(
      'va-process-list-item[header*="If we approve your claim, we’ll deposit your funds into your bank account"]',
    ).should('contain.text', 'You must have direct deposit set up');

    // Check travel pay claims status link
    cy.get(
      'va-link[href="/my-health/travel-pay/claims/"][text="Review your travel reimbursement claim status"]',
    ).should('be.visible');

    // Check direct deposit setup link
    cy.get(
      'va-link[href="/resources/how-to-set-up-direct-deposit-for-va-travel-pay-reimbursement/"][text="Learn how to set up direct deposit for travel pay"]',
    ).should('be.visible');
  });

  it('has submit another claim link action', () => {
    cy.visit(
      `${rootUrl}/file-new-claim/${appointmentId}/${claimId}/confirmation`,
    );

    // Check link action for submitting another claim
    cy.get(
      'va-link-action[text="Go to your past appointments to file another claim"][href="/my-health/appointments/past"]',
    ).should('be.visible');
  });

  it('displays help section', () => {
    cy.visit(
      `${rootUrl}/file-new-claim/${appointmentId}/${claimId}/confirmation`,
    );

    // Check contact section heading
    cy.get('h2').should('contain.text', 'Need help?');

    // Check phone numbers
    cy.get('va-telephone[contact="8555747292"]').should('be.visible');
    cy.get('va-telephone[contact="711"][tty]').should('be.visible');

    // Check hours of operation
    cy.get('p').should(
      'contain.text',
      `We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET`,
    );

    // Check Find the travel contact for your facility link
    cy.get(
      `va-link[href="${FIND_FACILITY_TP_CONTACT_LINK}"][text="Find the travel contact for your facility"]`,
    ).should('be.visible');
  });

  it('handles different appointment IDs in URL', () => {
    const differentApptId = '98765';
    const differentClaimId = 'claim-11111';

    cy.window().then(win => {
      win.sessionStorage.setItem('fileNewClaimEntry', 'appointment');
    });

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
        `${rootUrl}/file-new-claim/${appointmentId}/${claimId}/travel-agreement`,
      );

      // Agree to travel agreement and submit
      cy.selectVaCheckbox('accept-agreement', true);

      cy.get('va-button[continue]').click();

      cy.wait('@submitClaim');
      cy.wait('@claimDetails');

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
