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
//     cy.visit(
//       '/careers-employment/track-your-vre-benefits/vre-benefit-status/career-planning',
//     );
//     cy.wait('@featureToggles', { timeout: 20000 });

//     cy.injectAxeThenAxeCheck();
//     // eslint-disable-next-line cypress/unsafe-to-chain-command
//     cy.focused().then($el => {
//       expect($el.text()).to.contain('Career Planning');
//     });
//   });

//   it('toggles the first accordion item using keyboard (Tab to header)', () => {
//     cy.visit(
//       '/careers-employment/track-your-vre-benefits/vre-benefit-status/career-planning',
//     );
//     cy.wait('@featureToggles', { timeout: 20000 });

//     cy.window().then(win =>
//       win.customElements.whenDefined('va-accordion-item'),
//     );
//     cy.get('va-accordion-item')
//       .should('have.length', 3)
//       .and('have.class', 'hydrated');

//     cy.tabToElement('va-accordion-item');
//     cy.get('va-accordion-item')
//       .first()
//       .shadow()
//       .find('button')
//       .focus();

//     cy.get('va-accordion-item')
//       .first()
//       .shadow()
//       .find('button')
//       .should('have.attr', 'aria-expanded', 'true');

//     cy.realPress('Space');
//     cy.get('va-accordion-item')
//       .first()
//       .shadow()
//       .find('button')
//       .should('have.attr', 'aria-expanded', 'false');

//     cy.realPress('Enter');
//     cy.get('va-accordion-item')
//       .first()
//       .shadow()
//       .find('button')
//       .should('have.attr', 'aria-expanded', 'true');
//   });

//   it('navigates to Case Tracker via Back button using Enter', () => {
//     cy.visit(
//       '/careers-employment/track-your-vre-benefits/vre-benefit-status/career-planning',
//     );
//     cy.wait('@featureToggles', { timeout: 20000 });

//     cy.window().then(win => win.customElements.whenDefined('va-button'));
//     cy.get('va-button[back][text="Back to Case Tracker"]').should(
//       'have.class',
//       'hydrated',
//     );

//     cy.tabToElement('va-button[back][text="Back to Case Tracker"]');
//     cy.realPress('Enter');

//     cy.url().should('include', '/track-your-vre-benefits/vre-benefit-status');
//   });
// });
