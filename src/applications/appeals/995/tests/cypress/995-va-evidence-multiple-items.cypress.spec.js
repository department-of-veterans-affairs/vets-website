import manifest from '../../manifest.json';
import cypressSetup from '../../../shared/tests/cypress.setup';
import * as h from './995.cypress.helpers';
import { NOV_2025_REDESIGN_TOGGLE, TOGGLE_KEY } from '../../constants';
import mockData from '../fixtures/data/pre-api-comprehensive-test.json';
import { CONTESTABLE_ISSUES_API } from '../../constants/apis';
import {
  dateDetailsContent,
  datePromptContent,
  locationContent,
  promptContent,
  summaryContent,
} from '../../content/evidence/va';

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
              name: NOV_2025_REDESIGN_TOGGLE,
              value: true,
            },
            {
              name: TOGGLE_KEY,
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
      h.verifyFPSH3(promptContent.topQuestion);
      h.verifyFPSDesc(
        'We can collect your VA medical records or military health records',
      );
      h.checkErrorHandlingWithClass(
        h.VA_EVIDENCE_PROMPT_RADIOS,
        promptContent.requiredError,
      );

      h.selectVaPromptResponse('Y');

      // Location
      h.verifyH3(
        'What VA or military treatment location should we request records from?',
      );
      h.checkErrorHandlingWithClass(
        h.VA_EVIDENCE_LOCATION_WITH_NAME,
        locationContent.requiredError,
      );
      h.addVaLocation('South Texas VA Hospital');

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
      h.verifyH3(summaryContent.titleWithItems, 0);

      h.verifyArrayBuilderReviewVACard(
        0,
        'South Texas VA Hospital',
        'April 2002',
      );

      // ---------------------------------------- SECOND ITEM
      h.checkErrorHandlingWithClass(
        h.VA_EVIDENCE_PROMPT_RADIOS,
        summaryContent.requiredError,
      );
      h.selectVaPromptResponse('Y');

      // Location
      h.verifyH3(
        'What second VA or military treatment location should we request records from?',
      );
      h.addVaLocation('Midwest Alabama VA Clinic');

      h.clickContinue();

      // Treatment After 2005
      h.verifyH3(
        'Did treatment at Midwest Alabama VA Clinic start before 2005?',
      );
      h.addVaTreatmentAfter2005();

      h.verifyArrayBuilderReviewVACard(1, 'Midwest Alabama VA Clinic');

      // ---------------------------------------- THIRD ITEM
      h.selectVaPromptResponse('Y');

      // Location
      h.verifyH3(
        'What third VA or military treatment location should we request records from?',
      );
      h.addVaLocation('Northern California VA Urgent Care');

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
        'Nov. 1998',
      );

      // ---------------------------------------- FOURTH ITEM
      h.selectVaPromptResponse('Y');

      // Location
      h.verifyH3(
        'What fourth VA or military treatment location should we request records from?',
      );
      h.addVaLocation('Central Mississippi VA Medical Complex');

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
        'Sept. 2012',
      );

      // ---------------------------------------- EDITING FIRST ITEM
      h.clickArrayBuilderCardEditLink('South Texas VA Hospital');

      // Location
      h.verifyH3(
        'Edit the first VA or military treatment location we should request records from',
      );
      h.checkValueOfInput(
        `input${h.VA_EVIDENCE_LOCATION_WITH_NAME}`,
        'South Texas VA Hospital',
      );
      cy.fillVaTextInput(
        h.VA_EVIDENCE_LOCATION,
        'South Texas VA Medical Center',
      );
      h.clickContinue();

      // Treatment Before 2005
      h.verifyH3(
        'Edit if treatment at South Texas VA Medical Center started before 2005',
      );
      h.checkValueOfInput('input[name="root_treatmentBefore2005"]', 'Y');
      h.addVaTreatmentAfter2005();

      // Summary
      h.verifyArrayBuilderReviewVACard(0, 'South Texas VA Medical Center');
      h.checkAlertText(
        'record_0',
        'Success Alert South Texas VA Medical Center information has been updated.',
      );

      // ---------------------------------------- DELETING THIRD ITEM
      h.clickArrayBuilderDeleteCardButton('Northern California VA Urgent Care');
      h.clickArrayBuilderDeleteModalYesButton();

      // Same first card
      h.verifyArrayBuilderReviewVACard(0, 'South Texas VA Medical Center');

      // Same second card
      h.verifyArrayBuilderReviewVACard(1, 'Midwest Alabama VA Clinic');

      // New third card
      h.verifyArrayBuilderReviewVACard(
        2,
        'Central Mississippi VA Medical Complex',
        'Sept. 2012',
      );
    });
  });
});
