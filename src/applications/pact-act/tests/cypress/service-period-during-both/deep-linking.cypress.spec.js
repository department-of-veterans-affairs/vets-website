import * as h from '../helpers';
import { ROUTES } from '../../../constants';

// Note: anything requiring a VA button click is tested here as unit tests cannot
// target the shadow DOM
// Skipping temporarily while we do a URL change in devops (this will fail until that change is implemented)
// To be un-skipped on Wednesday, Nov 8
describe('PACT Act', () => {
  describe('During both of these time periods - deep linking', () => {
    it('redirects to home when the service period page is loaded without the right criteria', () => {
      cy.visit(`${h.ROOT}/${ROUTES.SERVICE_PERIOD}`);

      h.verifyUrl(ROUTES.HOME);

      // Home
      h.verifyElement(h.START_LINK);
      cy.injectAxeThenAxeCheck();
    });

    it('redirects to home when the burn pit 2-1 page is loaded without the right criteria', () => {
      cy.visit(`${h.ROOT}/${ROUTES.BURN_PIT_2_1}`);

      h.verifyUrl(ROUTES.HOME);

      // Home
      h.verifyElement(h.START_LINK);
      cy.injectAxeThenAxeCheck();
    });

    it('redirects to home when the burn pit 2-1-1 page is loaded without the right criteria', () => {
      cy.visit(`${h.ROOT}/${ROUTES.BURN_PIT_2_1_1}`);

      h.verifyUrl(ROUTES.HOME);

      // Home
      h.verifyElement(h.START_LINK);
      cy.injectAxeThenAxeCheck();
    });

    it('redirects to home when the burn pit 2-1-2 page is loaded without the right criteria', () => {
      cy.visit(`${h.ROOT}/${ROUTES.BURN_PIT_2_1_2}`);

      h.verifyUrl(ROUTES.HOME);

      // Home
      h.verifyElement(h.START_LINK);
      cy.injectAxeThenAxeCheck();
    });

    it('redirects to home when the agent orange 2-2-A page is loaded without the right criteria', () => {
      cy.visit(`${h.ROOT}/${ROUTES.ORANGE_2_2_A}`);

      h.verifyUrl(ROUTES.HOME);

      // Home
      h.verifyElement(h.START_LINK);
      cy.injectAxeThenAxeCheck();
    });

    it('redirects to home when the agent orange 2-2-B page is loaded without the right criteria', () => {
      cy.visit(`${h.ROOT}/${ROUTES.ORANGE_2_2_B}`);

      h.verifyUrl(ROUTES.HOME);

      // Home
      h.verifyElement(h.START_LINK);
      cy.injectAxeThenAxeCheck();
    });

    it('redirects to home when the agent orange 2-2-1-A page is loaded without the right criteria', () => {
      cy.visit(`${h.ROOT}/${ROUTES.ORANGE_2_2_1_A}`);

      h.verifyUrl(ROUTES.HOME);

      // Home
      h.verifyElement(h.START_LINK);
      cy.injectAxeThenAxeCheck();
    });

    it('redirects to home when the agent orange 2-2-1-B page is loaded without the right criteria', () => {
      cy.visit(`${h.ROOT}/${ROUTES.ORANGE_2_2_1_B}`);

      h.verifyUrl(ROUTES.HOME);

      // Home
      h.verifyElement(h.START_LINK);
      cy.injectAxeThenAxeCheck();
    });

    it('redirects to home when the agent orange 2-2-2 page is loaded without the right criteria', () => {
      cy.visit(`${h.ROOT}/${ROUTES.ORANGE_2_2_2}`);

      h.verifyUrl(ROUTES.HOME);

      // Home
      h.verifyElement(h.START_LINK);
      cy.injectAxeThenAxeCheck();
    });

    it('redirects to home when the agent orange 2-2-3 page is loaded without the right criteria', () => {
      cy.visit(`${h.ROOT}/${ROUTES.ORANGE_2_2_3}`);

      h.verifyUrl(ROUTES.HOME);

      // Home
      h.verifyElement(h.START_LINK);
      cy.injectAxeThenAxeCheck();
    });

    it('redirects to home when the radiation 2-3-A page is loaded without the right criteria', () => {
      cy.visit(`${h.ROOT}/${ROUTES.RADIATION_2_3_A}`);

      h.verifyUrl(ROUTES.HOME);

      // Home
      h.verifyElement(h.START_LINK);
      cy.injectAxeThenAxeCheck();
    });

    it('redirects to home when the radiation 2-3-B page is loaded without the right criteria', () => {
      cy.visit(`${h.ROOT}/${ROUTES.RADIATION_2_3_B}`);

      h.verifyUrl(ROUTES.HOME);

      // Home
      h.verifyElement(h.START_LINK);
      cy.injectAxeThenAxeCheck();
    });

    it('redirects to home when the lejeune 2-4 page is loaded without the right criteria', () => {
      cy.visit(`${h.ROOT}/${ROUTES.LEJEUNE_2_4}`);

      h.verifyUrl(ROUTES.HOME);

      // Home
      h.verifyElement(h.START_LINK);
      cy.injectAxeThenAxeCheck();
    });

    it('redirects to home when the results 1, p1 page is loaded without the right criteria', () => {
      cy.visit(`${h.ROOT}/${ROUTES.RESULTS_1_1}`);

      h.verifyUrl(ROUTES.HOME);

      // Home
      h.verifyElement(h.START_LINK);
      cy.injectAxeThenAxeCheck();
    });

    it('redirects to home when the results 1, p2 page is loaded without the right criteria', () => {
      cy.visit(`${h.ROOT}/${ROUTES.RESULTS_1_2}`);

      h.verifyUrl(ROUTES.HOME);

      // Home
      h.verifyElement(h.START_LINK);
      cy.injectAxeThenAxeCheck();
    });

    it('redirects to home when the results 2 page is loaded without the right criteria', () => {
      cy.visit(`${h.ROOT}/${ROUTES.RESULTS_2}`);

      h.verifyUrl(ROUTES.HOME);

      // Home
      h.verifyElement(h.START_LINK);
      cy.injectAxeThenAxeCheck();
    });

    it('redirects to home when the results 3page is loaded without the right criteria', () => {
      cy.visit(`${h.ROOT}/${ROUTES.RESULTS_3}`);

      h.verifyUrl(ROUTES.HOME);

      // Home
      h.verifyElement(h.START_LINK);
      cy.injectAxeThenAxeCheck();
    });
  });
});
