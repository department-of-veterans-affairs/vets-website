import manifest from '../../../manifest.json';
import cypressSetup from '../../../../shared/tests/cypress.setup';
import * as h from '../995.cypress.helpers';
import mockData from '../../fixtures/data/pre-api-comprehensive-test.json';
import { CONTESTABLE_ISSUES_API } from '../../../constants/apis';
import { promptContent } from '../../../content/evidence/va';
import * as sh from '../../../../shared/tests/cypress.helpers';
import { EVIDENCE_URLS } from '../../../constants';

const issues = mockData.data.contestedIssues;

describe('Array Builder evidence flow', () => {
  describe('VA evidence only', () => {
    it('navigates through the evidence pages adding a single item', () => {
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

      // Prompt
      h.verifyFPSH3(promptContent.question);
      h.verifyFPSDesc(
        'We can collect your VA medical records or military health records',
      );

      h.selectVaPromptResponse('Y');

      // Location
      h.verifyH3(
        'What VA or military treatment location should we request records from?',
      );
      h.addVaLocation('Central Boston VA Hospital');

      // Contestable Issues
      h.verifyH3(
        'What conditions were you treated for at Central Boston VA Hospital?',
      );
      cy.selectVaCheckbox('root_issuesVA_Headaches', true);
      cy.selectVaCheckbox('root_issuesVA_Sleep apnea', true);

      h.clickContinue();

      // Treatment Before 2005
      h.verifyH3(
        'Did treatment at Central Boston VA Hospital start before 2005?',
      );
      h.addVaTreatmentBefore2005();

      // Treatment Date
      h.verifyH3('When did treatment at Central Boston VA Hospital start?');
      h.addVaTreatmentDate('8', '1997');

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
        'Central Boston VA Hospital',
        2,
        'Headaches and Sleep apnea',
        'Aug. 1997',
      );

      // ---------------------------------------- EDITING ITEM
      h.clickArrayBuilderCardEditLink('Central Boston VA Hospital');

      // Location
      h.verifyH3(
        'Edit the first VA or military treatment location we should request records from',
      );
      h.checkValueOfInput(
        'input[name="root_treatmentLocation"]',
        'Central Boston VA Hospital',
      );
      cy.fillVaTextInput(
        'root_treatmentLocation',
        'Presbyterian Hospital (North Side)',
      );
      h.clickContinue();

      // Issues
      h.verifyH3(
        'Edit the conditions you were treated for at Presbyterian Hospital (North Side)',
      );
      h.confirmCheckboxesChecked('VA', ['Headaches', 'Sleep apnea']);
      cy.selectVaCheckbox('root_issuesVA_Headaches', false);
      h.clickContinue();

      // Treatment Before 2005
      h.verifyH3(
        'Edit if treatment at Presbyterian Hospital (North Side) started before 2005',
      );
      h.checkValueOfInput('input[name="root_treatmentBefore2005"]', 'Y');
      h.addVaTreatmentAfter2005();

      // Summary
      h.verifyArrayBuilderReviewVACard(
        0,
        'Presbyterian Hospital (North Side)',
        1,
        'Sleep apnea',
      );
      h.checkAlertText(
        'record_0',
        'Presbyterian Hospital (North Side) information has been updated.',
      );

      // ---------------------------------------- DELETING ONLY ITEM
      h.clickArrayBuilderDeleteCardButton('Presbyterian Hospital (North Side)');
      h.clickArrayBuilderDeleteModalYesButton();

      // Verify we're back to the beginning of the flow
      // Location
      sh.verifyCorrectUrl(manifest.rootUrl, EVIDENCE_URLS.vaSummary);
      h.verifyFPSH3(promptContent.question);

      h.checkAlertText(
        'record_0',
        `Presbyterian Hospital (North Side)’s information has been deleted`,
      );
    });
  });
});
