import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import rxList from './fixtures/listOfPrescriptions.json';

describe('Send Rx Renewal Message Component', () => {
  beforeEach(() => {
    const site = new MedicationsSite();
    site.login();
  });

  it('generates redirect URL using current page URL from list page', () => {
    const listPage = new MedicationsListPage();

    listPage.visitMedicationsListPageURL(rxList);

    cy.get('[data-testid="send-renewal-request-message-link"]')
      .first()
      .shadow()
      .find('a')
      .click();

    // Wait for modal to appear and verify it has correct properties
    cy.get('va-modal')
      .should('have.attr', 'status', 'info')
      .and('have.attr', 'primary-button-text', 'Continue');

    // Click the Continue button in the modal (need to traverse shadow DOMs)
    cy.get('va-modal')
      .shadow()
      .find('va-button')
      .first()
      .shadow()
      .find('button')
      .click();

    // Verify we're being redirected to secure messages with the correct redirectPath
    cy.url().should('include', '/my-health/secure-messages/new-message');
    cy.url().should('include', 'prescriptionId=');
    cy.url().should('include', 'redirectPath=');

    // The redirect path should be encoded and include the original medications page
    cy.url().then(redirectUrl => {
      const urlParams = new URLSearchParams(new URL(redirectUrl).search);
      const redirectPath = decodeURIComponent(urlParams.get('redirectPath'));
      // Verify the redirect path includes medications path and success flag
      expect(redirectPath).to.include('/my-health/medications');
      expect(redirectPath).to.include('rxRenewalMessageSuccess=true');
    });

    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('displays renewal request link for Active prescription with 0 refills on list page', () => {
    const listPage = new MedicationsListPage();

    listPage.visitMedicationsListPageURL(rxList);

    cy.get('[data-testid="active-no-refill-left"]')
      .should('be.visible')
      .and('contain', 'You have no refills left');

    cy.get('[data-testid="send-renewal-request-message-link"]')
      .should('exist')
      .and('be.visible');

    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('renewal request link is clickable', () => {
    const listPage = new MedicationsListPage();

    listPage.visitMedicationsListPageURL(rxList);

    cy.get('[data-testid="send-renewal-request-message-link"]')
      .first()
      .should('be.visible')
      .and('not.be.disabled');

    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('modal has correct properties and button text', () => {
    const listPage = new MedicationsListPage();

    listPage.visitMedicationsListPageURL(rxList);

    cy.get('va-modal')
      .should('have.attr', 'status', 'info')
      .and('have.attr', 'click-to-close', 'true')
      .and('have.attr', 'uswds', 'true')
      .and('have.attr', 'primary-button-text', 'Continue')
      .and('have.attr', 'secondary-button-text', 'Back')
      .and(
        'have.attr',
        'modal-title',
        "You're leaving medications to send a message",
      );

    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('displays fallback content for refill in process prescriptions', () => {
    const listPage = new MedicationsListPage();

    listPage.visitMedicationsListPageURL(rxList);

    cy.get('[data-testid="rx-refillinprocess-info"]').then($el => {
      if ($el.length > 0) {
        cy.wrap($el).should('be.visible');
      }
    });

    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('displays fallback content for submitted prescriptions', () => {
    const listPage = new MedicationsListPage();

    listPage.visitMedicationsListPageURL(rxList);

    cy.get('[data-testid="submitted-refill-request"]').then($el => {
      if ($el.length > 0) {
        cy.wrap($el).should('be.visible');
      }
    });

    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('displays fallback message for expired prescriptions older than 120 days', () => {
    const listPage = new MedicationsListPage();

    listPage.visitMedicationsListPageURL(rxList);

    cy.get('[data-testid="expired"]').then($expired => {
      if ($expired.length > 0) {
        cy.wrap($expired)
          .should('exist')
          .and('be.visible')
          .and(
            'contain',
            'Contact your VA provider if you need more of this medication',
          );
      }
    });

    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('does not display renewal link for non-VA prescriptions', () => {
    const listPage = new MedicationsListPage();

    listPage.visitMedicationsListPageURL(rxList);

    cy.get('[data-testid="non-VA-prescription"]').then($nonVA => {
      if ($nonVA.length > 0) {
        cy.wrap($nonVA).should('be.visible');

        const nonVAText = $nonVA.text();
        expect(nonVAText).to.include('manage this medication');

        // Verify no renewal link within the same card
        cy.wrap($nonVA)
          .closest('[data-testid="rx-card-info"]')
          .find('[data-testid="send-renewal-request-message-link"]')
          .should('not.exist');
      }
    });

    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('displays discontinued prescription message without renewal link', () => {
    const listPage = new MedicationsListPage();

    listPage.visitMedicationsListPageURL(rxList);

    cy.get('[data-testid="discontinued"]').then($discontinued => {
      if ($discontinued.length > 0) {
        cy.wrap($discontinued).should('be.visible');

        const discontinuedText = $discontinued.text();
        expect(discontinuedText).to.include('refill this prescription');
        expect(discontinuedText).to.include('Contact your VA provider');

        cy.wrap($discontinued)
          .parents('[data-testid="rx-card-info"]')
          .first()
          .find('[data-testid="send-renewal-request-message-link"]')
          .should('not.exist');
      }
    });

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
