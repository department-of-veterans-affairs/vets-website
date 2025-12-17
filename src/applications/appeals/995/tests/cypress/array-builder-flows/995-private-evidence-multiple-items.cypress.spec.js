import manifest from '../../../manifest.json';
import cypressSetup from '../../../../shared/tests/cypress.setup';
import * as h from '../995.cypress.helpers';
import mockData from '../../fixtures/data/pre-api-comprehensive-test.json';
import { CONTESTABLE_ISSUES_API } from '../../../constants/apis';

const issues = mockData.data.contestedIssues;

describe('Array Builder evidence flow', () => {
  describe('Private evidence only', () => {
    it('navigates through the evidence pages adding multiple items', () => {
      cypressSetup();

      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          type: 'feature_toggles',
          features: [
            {
              name: 'decision_review_sc_redesign_nov2025',
              value: true,
            },
          ],
        },
      }).as('features');

      cy.intercept('GET', `${CONTESTABLE_ISSUES_API}/compensation`, {
        data: issues,
      });

      cy.visit(manifest.rootUrl);
      cy.injectAxeThenAxeCheck();

      h.getToEvidenceFlow();

      // Facility Types
      h.checkVaFacilityBox();
      h.clickContinue();

      // VA Prompt
      h.selectVaPromptResponse('N');

      // ---------------------------------------- FIRST ITEM
      // Prompt
      h.selectPrivatePromptResponse('Y');

      // 4142 Auth
      cy.get('[name="privacy-agreement"]')
        .eq(0)
        .scrollIntoView();
    });
  });
});
