import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import rxList from './fixtures/listOfPrescriptions.json';
import oracleHealthRxList from './fixtures/oracle-health-prescriptions.json';
import cernerUser from './fixtures/cerner-user.json';

describe('Send Rx Renewal Message on List Page', () => {
  it('displays fallback message for Active prescription with 0 refills on list page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();

    site.login();
    listPage.visitMedicationsListPageURL(rxList);

    // Check for the active prescription with 0 refills message
    // The page displays "You can't refill..." with a curly apostrophe (')
    cy.get('[data-testid="active-no-refill-left"]')
      .first()
      .should('be.visible')
      .and(
        'contain',
        'Contact your VA provider if you need more of this medication.',
      );

    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('displays renewal request link when clicking from list page card', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();

    // Use Cerner user and Oracle Health prescriptions for renewal link
    site.login(true, false, cernerUser);
    listPage.visitMedicationsListPageURL(oracleHealthRxList);

    cy.get('[data-testid="send-renewal-request-message-link"]')
      .first()
      .should('be.visible');

    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('displays fallback content for refill in process prescriptions when showRenewalLink is false', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();

    site.login();
    listPage.visitMedicationsListPageURL(rxList);

    cy.get('[data-testid="rx-refillinprocess-info"]')
      .should('exist')
      .and('be.visible');

    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('displays fallback content for submitted prescriptions when showRenewalLink is false', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();

    site.login();
    listPage.visitMedicationsListPageURL(rxList);

    cy.get('[data-testid="submitted-refill-request"]').then($el => {
      if ($el.length > 0) {
        cy.wrap($el).should('be.visible');
      }
    });

    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('displays fallback message for expired prescriptions older than 120 days on list page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();

    site.login();
    listPage.visitMedicationsListPageURL(rxList);

    cy.get('[data-testid="expired"]').then($expired => {
      if ($expired.length > 0) {
        cy.wrap($expired)
          .should('exist')
          .and('be.visible')
          .and(
            'contain',
            'You can’t refill this prescription. Contact your VA provider if you need more of this medication.',
          );
      }
    });

    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('verifies modal has correct status and properties on list page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();

    // Use Cerner user and Oracle Health prescriptions for renewal link
    site.login(true, false, cernerUser);
    listPage.visitMedicationsListPageURL(oracleHealthRxList);

    cy.get('[data-testid="send-renewal-request-message-link"]')
      .first()
      .shadow()
      .find('a')
      .click();

    cy.get('va-modal')
      .should('have.attr', 'status', 'info')
      .and('have.attr', 'click-to-close', 'true')
      .and('have.attr', 'uswds', 'true');

    cy.get('va-modal')
      .should('have.attr', 'primary-button-text', 'Continue')
      .and('have.attr', 'secondary-button-text', 'Back');

    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('displays non-VA prescription message without renewal link', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();

    site.login();
    listPage.visitMedicationsListPageURL(rxList);

    cy.get('[data-testid="non-VA-prescription"]').then($nonVA => {
      if ($nonVA.length > 0) {
        cy.wrap($nonVA).should('be.visible');

        const nonVAText = $nonVA.text();
        expect(nonVAText).to.include('manage this medication');

        cy.wrap($nonVA)
          .parent()
          .find('[data-testid="send-renewal-request-message-link"]')
          .should('not.exist');
      }
    });

    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('displays discontinued prescription message without renewal link', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();

    site.login();
    listPage.visitMedicationsListPageURL(rxList);

    cy.get('[data-testid="discontinued"]').then($discontinued => {
      if ($discontinued.length > 0) {
        cy.wrap($discontinued).should('be.visible');

        const discontinuedText = $discontinued.text();
        expect(discontinuedText).to.include(
          'You can’t refill this prescription. Contact your VA provider if you need more of this medication.',
        );

        cy.wrap($discontinued)
          .parent()
          .find('[data-testid="send-renewal-request-message-link"]')
          .should('not.exist');
      }
    });

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
