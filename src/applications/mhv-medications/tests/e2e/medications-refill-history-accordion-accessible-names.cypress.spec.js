import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import prescriptionsList from './fixtures/grouped-prescriptions-list.json';
import rxDetails from './fixtures/older-prescription-details.json';

describe('Medications Accordion Accessible Names', () => {
  it('verifies accordion button names match visible labels (WCAG 2.5.3, 4.1.2)', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();

    // Login and navigate to prescription details with refill history
    site.login();
    listPage.visitMedicationsListPageURL(prescriptionsList);
    detailsPage.clickMedicationDetailsLink(rxDetails, 1);

    // Expand refill history accordion
    detailsPage.clickRefillHistoryAccordionOnDetailsPage();
    detailsPage.verifyAccordionExpandedOnDetailsPage();

    // Verify accordion items have accessible names matching visible text
    cy.get('[data-testid="refill-history-accordion"]')
      .find('va-accordion-item')
      .each(($item, _index) => {
        // Get the visible headline text
        cy.wrap($item)
          .find('[slot="headline"]')
          .invoke('text')
          .then(visibleText => {
            const trimmedText = visibleText.trim();

            // Verify the element does NOT have aria-label attribute
            cy.wrap($item)
              .find('[slot="headline"]')
              .should('not.have.attr', 'aria-label');

            // Verify accessible name matches visible text
            // The accessible name should come from the text content, not aria-label
            cy.wrap($item)
              .find('[slot="headline"]')
              .then($headline => {
                const accessibleName = $headline[0].textContent.trim();
                expect(accessibleName).to.equal(trimmedText);
              });

            // Verify expected format (e.g., "Refill", "Original fill", or "Partial fill")
            expect(trimmedText).to.match(
              /^(Refill|Original fill|Partial fill)$/,
            );
          });
      });

    // Run accessibility check
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        // Ensure these specific WCAG rules pass
        'label-content-name-mismatch': { enabled: true },
        'aria-valid-attr-value': { enabled: true },
      },
    });
  });
});
