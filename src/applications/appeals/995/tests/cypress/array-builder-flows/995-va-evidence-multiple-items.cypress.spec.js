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
      h.verifyFPSH3(
        'Do you want us to get your VA medical records or military health records?',
      );
      h.verifyFPSDesc(
        'We can collect your VA medical records or military health records',
      );
      h.selectVaPromptResponse('Y');

      // Location
      h.verifyH3(
        'What VA or military treatment location should we request records from?',
      );
      h.addVaLocation('South Texas VA Hospital');

      // Contestable Issues
      h.verifyH3(
        'What conditions were you treated for at South Texas VA Hospital?',
      );
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

      // Treatment Before 2005
      h.verifyH3('Did treatment at South Texas VA Hospital start before 2005?');
      h.addVaTreatmentBefore2005();

      // Treatment Date
      h.verifyH3('When did treatment at South Texas VA Hospital start?');
      h.addVaTreatmentDate('4', '2002');

      // Summary
      h.verifyArrayBuilderReviewVACard(
        0,
        'South Texas VA Hospital',
        `Review the evidence you’re submitting`,
        `VA or military treatment locations we’ll request your records from`,
        3,
        'Headaches; Hypertension; Tendonitis, left ankle; and Sleep apnea',
        'April 2002',
      );

      // ---------------------------------------- SECOND ITEM
      h.selectVaPromptResponse('Y');

      // Location
      h.verifyH3(
        'What second VA or military treatment location should we request records from?',
      );
      h.addVaLocation('Midwest Alabama VA Clinic');

      // Contestable Issues
      h.verifyH3(
        'What conditions were you treated for at Midwest Alabama VA Clinic?',
      );
      cy.get('[name="root_issuesVA_Hypertension"]')
        .eq(0)
        .click();
      cy.get('[name="root_issuesVA_Tendonitis, left ankle"]')
        .eq(0)
        .click();

      h.clickContinue();

      // Treatment After 2005
      h.verifyH3(
        'Did treatment at Midwest Alabama VA Clinic start before 2005?',
      );
      h.addVaTreatmentAfter2005();

      h.verifyArrayBuilderReviewVACard(
        1,
        'Midwest Alabama VA Clinic',
        `Review the evidence you’re submitting`,
        `VA or military treatment locations we’ll request your records from`,
        2,
        'Hypertension; and Tendonitis, left ankle',
      );

      // ---------------------------------------- THIRD ITEM
      h.selectVaPromptResponse('Y');

      // Location
      h.verifyH3(
        'What third VA or military treatment location should we request records from?',
      );
      h.addVaLocation('Northern California VA Urgent Care');

      // Contestable Issues
      h.verifyH3(
        'What conditions were you treated for at Northern California VA Urgent Care?',
      );
      cy.get('[name="root_issuesVA_Headaches"]')
        .eq(0)
        .click();
      cy.get('[name="root_issuesVA_Sleep apnea"]')
        .eq(0)
        .click();

      h.clickContinue();

      // Treatment Before 2005
      h.verifyH3(
        'Did treatment at Northern California VA Urgent Care start before 2005?',
      );
      h.addVaTreatmentBefore2005();

      // Treatment Date
      h.verifyH3(
        'When did treatment at Northern California VA Urgent Care start?',
      );
      h.addVaTreatmentDate('11', '1998');

      // Summary
      h.verifyArrayBuilderReviewVACard(
        2,
        'Northern California VA Urgent Care',
        `Review the evidence you’re submitting`,
        `VA or military treatment locations we’ll request your records from`,
        2,
        'Headaches and Sleep apnea',
        'Nov. 1998',
      );

      // ---------------------------------------- FOURTH ITEM
      h.selectVaPromptResponse('Y');

      // Location
      h.verifyH3(
        'What fourth VA or military treatment location should we request records from?',
      );
      h.addVaLocation('Central Mississippi VA Medical Complex');

      // Contestable Issues
      h.verifyH3(
        'What conditions were you treated for at Central Mississippi VA Medical Complex?',
      );
      cy.get('[name="root_issuesVA_Hypertension"]')
        .eq(0)
        .click();
      cy.get('[name="root_issuesVA_Tendonitis, left ankle"]')
        .eq(0)
        .click();

      h.clickContinue();

      // Treatment Before 2005
      h.verifyH3(
        'Did treatment at Central Mississippi VA Medical Complex start before 2005?',
      );
      h.addVaTreatmentBefore2005();

      // Treatment Date
      h.verifyH3(
        'When did treatment at Central Mississippi VA Medical Complex start?',
      );
      h.addVaTreatmentDate('9', '2012');

      // Summary
      h.verifyArrayBuilderReviewVACard(
        3,
        'Central Mississippi VA Medical Complex',
        `Review the evidence you’re submitting`,
        `VA or military treatment locations we’ll request your records from`,
        2,
        'Hypertension; and Tendonitis, left ankle',
        'Sept. 2012',
      );
    });
  });
});
