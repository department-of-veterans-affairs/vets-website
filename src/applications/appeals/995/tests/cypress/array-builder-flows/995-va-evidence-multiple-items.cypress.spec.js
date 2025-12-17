import manifest from '../../../manifest.json';
import cypressSetup from '../../../../shared/tests/cypress.setup';
import * as h from '../995.cypress.helpers';
import mockData from '../../fixtures/data/pre-api-comprehensive-test.json';
import { CONTESTABLE_ISSUES_API } from '../../../constants/apis';

const issues = mockData.data.contestedIssues;

describe('Array Builder evidence flow', () => {
  describe('VA evidence only', () => {
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

      // ---------------------------------------- FIRST ITEM
      // Prompt
      h.selectVaPromptResponse('Y');

      // Location
      h.addVaLocation('South Texas VA Hospital');

      // Contestable Issues
      cy.get('[name="root_issuesVA_Headaches"]')
        .eq(0)
        .click();
      cy.get('[name="root_issuesVA_Hypertension"]')
        .eq(0)
        .click();
      cy.get('[name="root_issuesVA_Tendonitis, left ankle"]')
        .eq(0)
        .click();
      cy.get('[name="root_issuesVA_Sleep apnea"]')
        .eq(0)
        .click();

      h.clickContinue();

      // Treatment Before 2005 / Treatment Date
      h.addVaTreatmentBefore2005('4', '2002');

      // Summary
      h.verifyArrayBuilderReviewVACard(
        0,
        'South Texas VA Hospital',
        3,
        'Headaches; Hypertension; Tendonitis, left ankle; and Sleep apnea',
        'April 2002',
      );

      // ---------------------------------------- SECOND ITEM
      h.selectVaPromptResponse('Y');
      cy.get('form h3').should(
        'have.text',
        'What second VA or military treatment location should we request records from?',
      );

      // Location
      h.addVaLocation('Midwest Alabama VA Clinic');

      // Contestable Issues
      cy.get('[name="root_issuesVA_Hypertension"]')
        .eq(0)
        .click();
      cy.get('[name="root_issuesVA_Tendonitis, left ankle"]')
        .eq(0)
        .click();

      h.clickContinue();

      // Treatment After 2005
      h.addVaTreatmentAfter2005();

      h.verifyArrayBuilderReviewVACard(
        1,
        'Midwest Alabama VA Clinic',
        2,
        'Hypertension; and Tendonitis, left ankle',
      );

      // ---------------------------------------- THIRD ITEM
      h.selectVaPromptResponse('Y');
      cy.get('form h3').should(
        'have.text',
        'What third VA or military treatment location should we request records from?',
      );

      // Location
      h.addVaLocation('Northern California VA Urgent Care');

      // Contestable Issues
      cy.get('[name="root_issuesVA_Headaches"]')
        .eq(0)
        .click();
      cy.get('[name="root_issuesVA_Sleep apnea"]')
        .eq(0)
        .click();

      h.clickContinue();

      // Treatment Before 2005 / Treatment Date
      h.addVaTreatmentBefore2005('11', '1998');

      // Summary
      h.verifyArrayBuilderReviewVACard(
        2,
        'Northern California VA Urgent Care',
        2,
        'Headaches and Sleep apnea',
        'Nov. 1998',
      );

      // ---------------------------------------- FOURTH ITEM
      h.selectVaPromptResponse('Y');
      cy.get('form h3').should(
        'have.text',
        'What fourth VA or military treatment location should we request records from?',
      );

      // Location
      h.addVaLocation('Central Mississippi VA Medical Complex');

      // Contestable Issues
      cy.get('[name="root_issuesVA_Hypertension"]')
        .eq(0)
        .click();
      cy.get('[name="root_issuesVA_Tendonitis, left ankle"]')
        .eq(0)
        .click();

      h.clickContinue();

      // Treatment Before 2005 / Treatment Date
      h.addVaTreatmentBefore2005('9', '2012');

      // Summary
      h.verifyArrayBuilderReviewVACard(
        3,
        'Central Mississippi VA Medical Complex',
        2,
        'Hypertension; and Tendonitis, left ankle',
        'Sept. 2012',
      );
    });
  });
});
