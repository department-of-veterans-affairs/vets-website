import manifest from '../../manifest.json';
import cypressSetup from '../../../shared/tests/cypress.setup';
import * as h from './995.cypress.helpers';
import { NOV_2025_REDESIGN_TOGGLE } from '../../constants';
import mockData from '../fixtures/data/pre-api-comprehensive-test.json';
import { CONTESTABLE_ISSUES_API } from '../../constants/apis';
import { introContent, summaryContent } from '../../content/evidence/private';
import * as sh from '../../../shared/tests/cypress.helpers';
import { content as limitedConsentContent } from '../../components/4142/LimitedConsent';
import { content as authContent } from '../../components/4142/Authorization';

const issues = mockData.data.contestedIssues;

describe('Array Builder evidence flow', () => {
  describe('Private evidence only', () => {
    it('navigates through the evidence pages adding single item', () => {
      cypressSetup();

      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          type: 'feature_toggles',
          features: [
            {
              name: NOV_2025_REDESIGN_TOGGLE,
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
      h.verifyFPSH3(
        'Do you want us to get your private (non-VA) provider or VA Vet Center medical records?',
      );
      h.verifyFPSDesc(
        'You have private provider or VA Vet Center medical records if you were treated by a:',
      );

      h.selectPrivatePromptResponse('y');

      // 4142 Auth
      cy.get('#privacy-agreement')
        .shadow()
        .find('div input')
        .eq(0)
        .scrollIntoView()
        .click();

      cy.selectRadio('limited-consent', 'Y');

      cy.fillVaTextarea(
        'limited-consent-description',
        'Do not include prescription drugs or follow-up visits',
      );

      h.verifyH3(authContent.title);
      h.verifyFPSH3(limitedConsentContent.prompt);
      h.checkTextareaLabel(
        'limited-consent-description',
        limitedConsentContent.textareaLabel,
      );

      h.clickContinue();

      // Intro page
      h.verifyH3(introContent.title);
      h.clickContinue();

      // Location
      h.verifyH3(
        'What location should we request your private provider or VA Vet Center records from?',
      );

      h.addPrivateLocationData(
        'Rainier Urgent Care',
        '980 Mountain Rd',
        'Seattle',
        'WA',
        '90839',
      );

      // Contestable Issues
      h.verifyH3(
        'What conditions were you treated for at Rainier Urgent Care?',
      );
      cy.get('[name="root_issues_Hypertension"]')
        .eq(0)
        .click();
      cy.get('[name="root_issues_Tendonitis, left ankle"]')
        .eq(0)
        .click();

      h.clickContinue();

      // Treatment Dates
      h.verifyH3('When were you treated at Rainier Urgent Care?');
      h.clickContinue();

      h.addPrivateTreatmentDates('2019-11-03', '2020-02-29');

      // Summary
      h.verifyH3(summaryContent.title, 0);

      h.verifyArrayBuilderReviewPrivateCard(
        0,
        'Rainier Urgent Care',
        2,
        'Hypertension; and Tendonitis, left ankle',
        'Nov. 3, 2019 to Feb. 29, 2020',
      );

      // ---------------------------------------- DELETING ONLY ITEM
      h.clickArrayBuilderDeleteCardButton('Rainier Urgent Care');
      h.clickArrayBuilderDeleteModalYesButton();

      // Verify we're back to the beginning of the flow
      // Location
      sh.verifyCorrectUrl(
        manifest.rootUrl,
        `/supporting-evidence/0/private-medical-records-location`,
      );
      h.verifyH3(
        'What location should we request your private provider or VA Vet Center records from?',
      );

      h.checkAlertText(
        null,
        `Warning Alert You must add at least one record for us to process this form.`,
        'warning',
      );
    });
  });
});
