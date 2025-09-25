import * as h from './helpers';
import { ROUTES } from '../../constants';

describe('Decision Reviews Onramp', () => {
  describe('deep linking', () => {
    it('redirects to introduction when a question page is loaded without the right criteria', () => {
      cy.visit(`${h.ROOT}/${ROUTES.Q_1_1_CLAIM_DECISION}`);

      h.verifyUrl(ROUTES.INTRODUCTION);

      // Introduction
      h.verifyElement(h.START_LINK);
      cy.injectAxeThenAxeCheck();
    });

    it('redirects to introduction when the results page is loaded without the right criteria', () => {
      cy.visit(`${h.ROOT}/${ROUTES.RESULTS_DR}`);

      h.verifyUrl(ROUTES.INTRODUCTION);

      // Introduction
      h.verifyElement(h.START_LINK);
      cy.injectAxeThenAxeCheck();
    });
  });
});
