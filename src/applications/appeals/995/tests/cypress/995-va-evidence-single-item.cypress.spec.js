import manifest from '../../manifest.json';
import cypressSetup from '../../../shared/tests/cypress.setup';
import * as h from './995.cypress.helpers';
import mockData from '../fixtures/data/pre-api-comprehensive-test.json';
import { CONTESTABLE_ISSUES_API } from '../../constants/apis';
import { promptContent, summaryContent } from '../../content/evidence/va';
import * as sh from '../../../shared/tests/cypress.helpers';
import {
  EVIDENCE_URLS,
  NOV_2025_REDESIGN_TOGGLE,
  TOGGLE_KEY,
} from '../../constants';

const issues = mockData.data.contestedIssues;

describe('Array Builder evidence flow', () => {
  describe('VA evidence only, mouse navigation', () => {
    it('navigates through the evidence pages adding a single item', () => {
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

      // Prompt
      h.verifyFPSH3(promptContent.topQuestion);
      h.verifyFPSDesc(
        'We can collect your VA medical records or military health records',
      );

      h.selectVaPromptResponse('Y');

      // Location
      h.verifyH3(
        'What VA or military treatment location should we request records from?',
      );
      h.addVaLocation('Central Boston VA Hospital');

      // Treatment Before 2005
      h.verifyH3(
        'Did treatment at Central Boston VA Hospital start before 2005?',
      );
      h.addVaTreatmentBefore2005();

      // Treatment Date
      h.verifyH3('When did treatment at Central Boston VA Hospital start?');
      h.addVaTreatmentDate('8', '1997');

      // Summary
      h.verifyH3(summaryContent.titleWithItems, 0);

      h.verifyArrayBuilderReviewVACard(
        0,
        'Central Boston VA Hospital',
        'Aug. 1997',
      );

      // // ---------------------------------------- EDITING ITEM
      h.clickArrayBuilderCardEditLink('Central Boston VA Hospital');

      // // Location
      h.verifyH3(
        'Edit the first VA or military treatment location we should request records from',
      );
      h.checkValueOfInput(
        'input[name="root_vaTreatmentLocation"]',
        'Central Boston VA Hospital',
      );
      cy.fillVaTextInput(
        'root_vaTreatmentLocation',
        'Presbyterian Hospital (North Side)',
      );
      h.clickContinue();

      // // Treatment Before 2005
      h.verifyH3(
        'Edit if treatment at Presbyterian Hospital (North Side) started before 2005',
      );
      h.checkValueOfInput('input[name="root_treatmentBefore2005"]', 'Y');
      h.addVaTreatmentAfter2005();

      // Summary
      // h.verifyArrayBuilderReviewVACard(0, 'Presbyterian Hospital (North Side)');
      h.checkAlertText(
        'record_0',
        'Success Alert Presbyterian Hospital (North Side) information has been updated.',
      );

      // ---------------------------------------- DELETING ONLY ITEM
      h.clickArrayBuilderDeleteCardButton('Presbyterian Hospital (North Side)');
      h.clickArrayBuilderDeleteModalYesButton();

      // Verify we're back to the beginning of the flow
      // Location
      sh.verifyCorrectUrl(manifest.rootUrl, EVIDENCE_URLS.vaPromptSummary);
      h.verifyFPSH3(promptContent.topQuestion);

      h.checkAlertText(
        'record_0',
        `Success Alert Presbyterian Hospital (North Side)’s information has been deleted`,
      );
    });

    describe('VA evidence only, keyboard navigation', () => {
      it('navigates through the evidence pages adding a single item', () => {
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
        h.verifyUrl(h.FACILITY_TYPES_PATH);
        cy.setCheckboxFromData(h.VA_EVIDENCE_CHECKBOX, true);
        cy.setCheckboxFromData(h.NON_VA_EVIDENCE_CHECKBOX, true);
        h.tabToContinue();

        // Prompt
        h.verifyFPSH3(promptContent.topQuestion);
        h.verifyFPSDesc(
          'We can collect your VA medical records or military health records',
        );

        h.selectVaPromptResponse('Y');

        // Location
        h.verifyH3(
          'What VA or military treatment location should we request records from?',
        );
        h.addVaLocation('Central Boston VA Hospital');

        // Treatment Before 2005
        h.verifyH3(
          'Did treatment at Central Boston VA Hospital start before 2005?',
        );
        h.addVaTreatmentBefore2005();

        // Treatment Date
        h.verifyH3('When did treatment at Central Boston VA Hospital start?');
        h.addVaTreatmentDate('8', '1997');

        // Summary
        h.verifyH3(summaryContent.titleWithItems, 0);

        h.verifyArrayBuilderReviewVACard(
          0,
          'Central Boston VA Hospital',
          'Aug. 1997',
        );

        // // ---------------------------------------- EDITING ITEM
        h.clickArrayBuilderCardEditLink('Central Boston VA Hospital');

        // // Location
        h.verifyH3(
          'Edit the first VA or military treatment location we should request records from',
        );
        h.checkValueOfInput(
          'input[name="root_vaTreatmentLocation"]',
          'Central Boston VA Hospital',
        );
        cy.fillVaTextInput(
          'root_vaTreatmentLocation',
          'Presbyterian Hospital (North Side)',
        );
        h.clickContinue();

        // // Treatment Before 2005
        h.verifyH3(
          'Edit if treatment at Presbyterian Hospital (North Side) started before 2005',
        );
        h.checkValueOfInput('input[name="root_treatmentBefore2005"]', 'Y');
        h.addVaTreatmentAfter2005();

        // Summary
        // h.verifyArrayBuilderReviewVACard(0, 'Presbyterian Hospital (North Side)');
        h.checkAlertText(
          'record_0',
          'Success Alert Presbyterian Hospital (North Side) information has been updated.',
        );

        // ---------------------------------------- DELETING ONLY ITEM
        h.clickArrayBuilderDeleteCardButton(
          'Presbyterian Hospital (North Side)',
        );
        h.clickArrayBuilderDeleteModalYesButton();

        // Verify we're back to the beginning of the flow
        // Location
        sh.verifyCorrectUrl(manifest.rootUrl, EVIDENCE_URLS.vaPromptSummary);
        h.verifyFPSH3(promptContent.topQuestion);

        h.checkAlertText(
          'record_0',
          `Success Alert Presbyterian Hospital (North Side)’s information has been deleted`,
        );
      });
    });
  });
});
