// // Read inside Shadow DOM for this spec
// Cypress.config('includeShadowDom', true);

// describe('CH31 Career Planning Keyboard Only Navigation', () => {
//   beforeEach(() => {
//     cy.login();

//     cy.intercept('GET', '**/v0/feature_toggles*', {
//       data: {
//         type: 'feature_toggles',
//         features: [
//           { name: 'vre_eligibility_status_phase_2_updates', value: true },
//         ],
//       },
//     }).as('featureToggles');
//   });

//   it('focuses the main heading on load and passes basic a11y check', () => {
//     cy.visit('/careers-employment/your-vre-eligibility/career-planning');
//     cy.wait('@featureToggles', { timeout: 20000 });

//     cy.injectAxeThenAxeCheck();
//     cy.focused().should('contain.text', 'Career Planning');
//   });

//   it('toggles the first accordion item using keyboard (Tab to header)', () => {
//     cy.visit('/careers-employment/your-vre-eligibility/career-planning');
//     cy.wait('@featureToggles', { timeout: 20000 });

//     // Ensure web components are hydrated
//     cy.window().then(win =>
//       win.customElements.whenDefined('va-accordion-item'),
//     );
//     cy.get('va-accordion-item')
//       .should('have.length', 3)
//       .and('have.class', 'hydrated');

//     // Tab to the first accordion item host, then focus header button inside shadow
//     cy.tabToElement('va-accordion-item');
//     cy.get('va-accordion-item')
//       .first()
//       .shadow()
//       .find('button')
//       .focus();

//     // Initially open (attribute value is a string)
//     cy.get('va-accordion-item')
//       .first()
//       .shadow()
//       .find('button')
//       .should('have.attr', 'aria-expanded', 'true');

//     // Close with Space
//     cy.realPress('Space');
//     cy.get('va-accordion-item')
//       .first()
//       .shadow()
//       .find('button')
//       .should('have.attr', 'aria-expanded', 'false');

//     // Open with Enter
//     cy.realPress('Enter');
//     cy.get('va-accordion-item')
//       .first()
//       .shadow()
//       .find('button')
//       .should('have.attr', 'aria-expanded', 'true');
//   });

//   it('navigates to Case Tracker via Back button using Enter', () => {
//     cy.visit('/careers-employment/your-vre-eligibility/career-planning');
//     cy.wait('@featureToggles', { timeout: 20000 });

//     cy.window().then(win => win.customElements.whenDefined('va-button'));
//     cy.get('va-button[back][text="Back to Case Tracker"]').should(
//       'have.class',
//       'hydrated',
//     );

//     // Tab to Back button host (inner button receives focus), then Enter
//     cy.tabToElement('va-button[back][text="Back to Case Tracker"]');
//     cy.realPress('Enter');

//     cy.url().should('include', '/my-case-management-hub');
//   });
// });
