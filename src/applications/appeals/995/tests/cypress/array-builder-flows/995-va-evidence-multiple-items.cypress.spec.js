import manifest from '../../../manifest.json';
import cypressSetup from '../../../../shared/tests/cypress.setup';
import * as h from '../995.cypress.helpers';
import mockData from '../../fixtures/data/pre-api-comprehensive-test.json';
import { CONTESTABLE_ISSUES_API } from '../../../constants/apis';
import {
  dateDetailsContent,
  datePromptContent,
  locationContent,
  promptContent,
  summaryContent,
} from '../../../content/evidence/va';
import { issuesContent } from '../../../pages/evidence/common';

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
      h.verifyFPSH3(promptContent.question);
      h.verifyFPSDesc(
        'We can collect your VA medical records or military health records',
      );
      h.checkErrorHandlingWithClass(
        '[name="root_hasVaEvidence"]',
        promptContent.requiredError,
      );

      h.selectVaPromptResponse('Y');

      // Location
      h.verifyH3(
        'What VA or military treatment location should we request records from?',
      );
      h.checkErrorHandlingWithClass(
        '[name="root_treatmentLocation"]',
        locationContent.requiredError,
      );
      h.addVaLocation('South Texas VA Hospital');

      // Contestable Issues
      h.verifyH3(
        'What conditions were you treated for at South Texas VA Hospital?',
      );
      h.checkErrorHandlingWithClass(
        '[name="root_issuesVA"]',
        issuesContent.requiredError,
      );
      cy.selectVaCheckbox('root_issuesVA_Headaches', true);
      cy.selectVaCheckbox('root_issuesVA_Hypertension', true);
      cy.selectVaCheckbox('root_issuesVA_Tendonitis, left ankle', true);
      cy.selectVaCheckbox('root_issuesVA_Sleep apnea', true);

      h.clickContinue();

      // Treatment Before 2005
      h.verifyH3('Did treatment at South Texas VA Hospital start before 2005?');
      h.checkErrorHandlingWithClass(
        '[name="root_treatmentBefore2005"]',
        datePromptContent.requiredError,
      );
      h.addVaTreatmentBefore2005();

      // Treatment Date
      h.verifyH3('When did treatment at South Texas VA Hospital start?');
      h.checkErrorHandlingWithId(
        '[name="root_treatmentMonthYear"]',
        dateDetailsContent.requiredError,
      );
      h.addVaTreatmentDate('4', '2002');

      // Summary
      h.verifyH3(`Review the evidence you’re submitting`, 0);

      cy.get('span h4')
        .eq(0)
        .should('exist')
        .and('be.visible')
        .and(
          'have.text',
          `VA or military treatment locations we’ll request your records from`,
        );

      h.verifyArrayBuilderReviewVACard(
        0,
        'South Texas VA Hospital',
        3,
        'Headaches; Hypertension; Tendonitis, left ankle; and Sleep apnea',
        'April 2002',
      );

      // ---------------------------------------- SECOND ITEM
      h.checkErrorHandlingWithClass(
        '[name="root_hasVaEvidence"]',
        summaryContent.requiredError,
      );
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
      cy.selectVaCheckbox('root_issuesVA_Hypertension', true);
      cy.selectVaCheckbox('root_issuesVA_Tendonitis, left ankle', true);

      h.clickContinue();

      // Treatment After 2005
      h.verifyH3(
        'Did treatment at Midwest Alabama VA Clinic start before 2005?',
      );
      h.addVaTreatmentAfter2005();

      h.verifyArrayBuilderReviewVACard(
        1,
        'Midwest Alabama VA Clinic',
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
      cy.selectVaCheckbox('root_issuesVA_Headaches', true);
      cy.selectVaCheckbox('root_issuesVA_Sleep apnea', true);

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
      cy.selectVaCheckbox('root_issuesVA_Hypertension', true);
      cy.selectVaCheckbox('root_issuesVA_Tendonitis, left ankle', true);

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
        2,
        'Hypertension; and Tendonitis, left ankle',
        'Sept. 2012',
      );

      // ---------------------------------------- EDITING FIRST ITEM
      h.clickArrayBuilderCardEditLink('South Texas VA Hospital');

      // Location
      h.verifyH3(
        'Edit the first VA or military treatment location we should request records from',
      );
      h.checkValueOfInput(
        'input[name="root_treatmentLocation"]',
        'South Texas VA Hospital',
      );
      cy.fillVaTextInput(
        'root_treatmentLocation',
        'South Texas VA Medical Center',
      );
      h.clickContinue();

      // Issues
      h.verifyH3(
        'Edit the conditions you were treated for at South Texas VA Medical Center',
      );
      h.confirmCheckboxesChecked('VA', [
        'Headaches',
        'Hypertension',
        'Tendonitis, left ankle',
        'Sleep apnea',
      ]);
      cy.selectVaCheckbox('root_issuesVA_Hypertension', false);
      h.clickContinue();

      // Treatment Before 2005
      h.verifyH3(
        'Edit if treatment at South Texas VA Medical Center started before 2005',
      );
      h.checkValueOfInput('input[name="root_treatmentBefore2005"]', 'Y');
      h.addVaTreatmentAfter2005();

      // Summary
      h.verifyArrayBuilderReviewVACard(
        0,
        'South Texas VA Medical Center',
        3,
        'Headaches; Tendonitis, left ankle; and Sleep apnea',
      );
      h.checkAlertText(
        'record_0',
        'South Texas VA Medical Center information has been updated.',
      );

      // ---------------------------------------- DELETING THIRD ITEM
      h.clickArrayBuilderDeleteCardButton('Northern California VA Urgent Care');
      h.clickArrayBuilderDeleteModalYesButton();

      // Same first card
      h.verifyArrayBuilderReviewVACard(
        0,
        'South Texas VA Medical Center',
        3,
        'Headaches; Tendonitis, left ankle; and Sleep apnea',
      );

      // Same second card
      h.verifyArrayBuilderReviewVACard(
        1,
        'Midwest Alabama VA Clinic',
        2,
        'Hypertension; and Tendonitis, left ankle',
      );

      // New third card
      h.verifyArrayBuilderReviewVACard(
        2,
        'Central Mississippi VA Medical Complex',
        2,
        'Hypertension; and Tendonitis, left ankle',
        'Sept. 2012',
      );
    });
  });
});
