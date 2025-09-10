import * as h from './helpers';
import { ROUTES } from '../../constants';

// TODO: This test won't work properly until we get this PR merged
// https://github.com/department-of-veterans-affairs/vsp-platform-revproxy/pull/983
// which is waiting on a finalized DR onramp URL
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
      cy.visit(`${h.ROOT}/${ROUTES.RESULTS}`);

      h.verifyUrl(ROUTES.INTRODUCTION);

      // Introduction
      h.verifyElement(h.START_LINK);
      cy.injectAxeThenAxeCheck();
    });
  });
});
