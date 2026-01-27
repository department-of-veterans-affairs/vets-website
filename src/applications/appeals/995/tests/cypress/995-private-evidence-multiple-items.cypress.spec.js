import manifest from '../../manifest.json';
import cypressSetup from '../../../shared/tests/cypress.setup';
import * as h from './995.cypress.helpers';
import {
  EVIDENCE_ADDITIONAL_URL,
  NOV_2025_REDESIGN_TOGGLE,
  TOGGLE_KEY,
} from '../../constants';
import mockData from '../fixtures/data/pre-api-comprehensive-test.json';
import { CONTESTABLE_ISSUES_API } from '../../constants/apis';
import {
  detailsEntryContent,
  introContent,
  summaryContent,
  treatmentDateContent,
} from '../../content/evidence/private';
import { privateRecordsPromptError } from '../../components/evidence/PrivatePrompt';
import { issuesContent } from '../../pages/evidence/privateEvidence';
import { content as limitedConsentContent } from '../../components/4142/LimitedConsent';
import { content as authContent } from '../../components/4142/Authorization';

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
      h.checkErrorHandlingWithClass(
        '[name="root_hasPrivateEvidence"]',
        privateRecordsPromptError,
      );

      h.selectPrivatePromptResponse('y');

      // 4142 Auth
      // Check error handling
      h.clickContinue();

      h.checkAlertText(
        null,
        'Error Alert We need your authorization to request your medical records',
        'error',
      );

      h.checkError(
        '[name="root_limitedConsent"]',
        limitedConsentContent.radioError,
      );

      cy.get('#privacy-agreement')
        .shadow()
        .find('div input')
        .eq(0)
        .scrollIntoView()
        .click();

      cy.selectRadio('limited-consent', 'Y');

      // Trigger textarea error
      h.clickContinue();

      h.checkError(
        '[name="limited-consent-description"]',
        limitedConsentContent.textareaError,
      );

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

      // Check error handling
      h.clickContinue();
      h.checkError(
        '[name="root_privateTreatmentLocation"]',
        detailsEntryContent.locationRequiredError,
      );
      h.checkError('[name="root_address_country"]', 'Select a country');
      cy.selectVaSelect('root_address_country', 'USA');
      h.checkError('[name="root_address_street"]', 'Enter a street address');
      h.checkError('[name="root_address_city"]', 'Enter a city');
      h.checkError('[name="root_address_state"]', 'Select a state');
      h.checkError('[name="root_address_postalCode"]', 'Enter a zip code');

      h.addPrivateLocationData(
        'Johns Hopkins Hospital',
        '123 Main Street',
        'Baltimore',
        'MD',
        '21287',
      );

      // Contestable Issues
      h.verifyH3(
        'What conditions were you treated for at Johns Hopkins Hospital?',
      );
      h.checkErrorHandlingWithClass(
        '[name="root_issues"]',
        issuesContent.requiredError,
      );
      cy.get('[name="root_issues_Hypertension"]')
        .eq(0)
        .click();
      cy.get('[name="root_issues_Tendonitis, left ankle"]')
        .eq(0)
        .click();

      h.clickContinue();

      // Treatment Dates
      h.verifyH3('When were you treated at Johns Hopkins Hospital?');
      h.clickContinue();

      // Check error messaging
      h.checkError(
        '[name="root_treatmentStart"]',
        treatmentDateContent.requiredError,
      );
      h.checkError(
        '[name="root_treatmentEnd"]',
        treatmentDateContent.requiredError,
      );
      h.addPrivateTreatmentDates('2020-03-01', '2020-11-18');

      // Summary
      h.verifyH3(summaryContent.title, 0);

      h.verifyArrayBuilderReviewPrivateCard(
        0,
        'Johns Hopkins Hospital',
        2,
        'Hypertension; and Tendonitis, left ankle',
        'March 1, 2020 to Nov. 18, 2020',
      );

      // ---------------------------------------- SECOND ITEM
      h.checkErrorHandlingWithClass(
        '[name="root_hasPrivateEvidence"]',
        summaryContent.requiredError,
      );

      h.selectPrivatePromptRepeaterResponse('Y');

      // Location
      h.verifyH3(
        'What second location should we request your private provider or VA Vet Center records from?',
      );
      h.addPrivateLocationData(
        'Methodist Stone Oak Hospital',
        '456 Elm Street',
        'Baltimore',
        'MD',
        '21287',
        '#235',
      );

      // Contestable Issues
      h.verifyH3(
        'What conditions were you treated for at Methodist Stone Oak Hospital?',
      );
      cy.get('[name="root_issues_Sleep apnea"]')
        .eq(0)
        .click();
      cy.get('[name="root_issues_Headaches"]')
        .eq(0)
        .click();

      h.clickContinue();

      // Treatment Dates
      h.verifyH3('When were you treated at Methodist Stone Oak Hospital?');
      h.addPrivateTreatmentDates('1980-07-16', '2001-01-03');

      // Summary
      h.verifyArrayBuilderReviewPrivateCard(
        1,
        'Methodist Stone Oak Hospital',
        2,
        'Headaches and Sleep apnea',
        'July 16, 1980 to Jan. 3, 2001',
      );

      // ---------------------------------------- THIRD ITEM
      h.selectPrivatePromptRepeaterResponse('Y');

      // Location
      h.verifyH3(
        'What third location should we request your private provider or VA Vet Center records from?',
      );
      h.addPrivateLocationData(
        'Uptown Urgent Care',
        '900 75th St.',
        'Baltimore',
        'MD',
        '21287',
      );

      // Contestable Issues
      h.verifyH3('What conditions were you treated for at Uptown Urgent Care?');
      cy.get('[name="root_issues_Sleep apnea"]')
        .eq(0)
        .click();
      cy.get('[name="root_issues_Headaches"]')
        .eq(0)
        .click();

      cy.get('[name="root_issues_Hypertension"]')
        .eq(0)
        .click();
      cy.get('[name="root_issues_Tendonitis, left ankle"]')
        .eq(0)
        .click();

      h.clickContinue();

      // Treatment Dates
      h.verifyH3('When were you treated at Uptown Urgent Care?');
      h.addPrivateTreatmentDates('1999-10-04', '1999-10-04');

      // Summary
      h.verifyArrayBuilderReviewPrivateCard(
        2,
        'Uptown Urgent Care',
        4,
        'Headaches; Hypertension; Tendonitis, left ankle; and Sleep apnea',
        'Oct. 4, 1999 to Oct. 4, 1999',
      );

      h.selectPrivatePromptRepeaterResponse('N');
      cy.url().should(
        'contain',
        `${manifest.rootUrl}/${EVIDENCE_ADDITIONAL_URL}`,
      );

      cy.go('back');

      // ---------------------------------------- EDITING SECOND ITEM
      h.clickArrayBuilderCardEditLink('Methodist Stone Oak Hospital');

      // Location
      h.verifyH3(
        'Edit the second location we should request your private provider or VA Vet Center records from',
      );
      h.checkValueOfInput(
        '[name="root_privateTreatmentLocation"]',
        'Methodist Stone Oak Hospital',
      );
      h.checkValueOfInput('[name="root_address_country"]', 'USA');
      h.checkValueOfInput('[name="root_address_street"]', '456 Elm Street');
      h.checkValueOfInput('[name="root_address_city"]', 'Baltimore');
      h.checkValueOfInput('[name="root_address_state"]', 'MD');
      h.checkValueOfInput('[name="root_address_postalCode"]', '21287');
      h.checkValueOfInput('[name="root_address_street2"]', '#235');

      cy.fillVaTextInput(
        'root_privateTreatmentLocation',
        'Baltimore Methodist General Hospital',
      );

      h.clickContinue();

      // Issues
      h.verifyH3(
        'Edit the conditions you were treated for at Baltimore Methodist General Hospital',
      );
      h.confirmCheckboxesChecked(['Headaches', 'Sleep apnea']);
      cy.selectVaCheckbox('root_issues_Hypertension', true);
      h.clickContinue();

      // Treatment Dates
      h.verifyH3(
        'Edit when you were treated at Baltimore Methodist General Hospital',
      );
      h.checkValueOfTreatmentDateInput(0, '7');
      h.checkValueOfTreatmentDateInput(1, '16');
      h.checkValueOfTreatmentDateInput(2, '1980');
      h.checkValueOfTreatmentDateInput(3, '1');
      h.checkValueOfTreatmentDateInput(4, '3');
      h.checkValueOfTreatmentDateInput(5, '2001');

      cy.get('va-text-input')
        .eq(1)
        .shadow()
        .find('input')
        .focus()
        .clear();

      h.fillVaTextInputWithoutName('root_treatmentStartDay', '20');

      h.clickContinue();

      // Summary
      h.verifyArrayBuilderReviewPrivateCard(
        0,
        'Johns Hopkins Hospital',
        2,
        'Hypertension; and Tendonitis, left ankle',
        'March 1, 2020 to Nov. 18, 2020',
      );

      h.verifyArrayBuilderReviewPrivateCard(
        1,
        'Baltimore Methodist General Hospital',
        2,
        'Headaches, Hypertension, and Sleep apnea',
        'July 20, 1980 to Jan. 3, 2001',
      );

      h.verifyArrayBuilderReviewPrivateCard(
        2,
        'Uptown Urgent Care',
        4,
        'Headaches; Hypertension; Tendonitis, left ankle; and Sleep apnea',
        'Oct. 4, 1999 to Oct. 4, 1999',
      );

      // ---------------------------------------- DELETING FIRST ITEM
      h.clickArrayBuilderDeleteCardButton('Johns Hopkins Hospital');
      h.clickArrayBuilderDeleteModalYesButton();

      // New first card
      h.verifyArrayBuilderReviewPrivateCard(
        0,
        'Baltimore Methodist General Hospital',
        2,
        'Headaches, Hypertension, and Sleep apnea',
        'July 20, 1980 to Jan. 3, 2001',
      );

      // New second card
      h.verifyArrayBuilderReviewPrivateCard(
        1,
        'Uptown Urgent Care',
        4,
        'Headaches; Hypertension; Tendonitis, left ankle; and Sleep apnea',
        'Oct. 4, 1999 to Oct. 4, 1999',
      );
    });
  });
});
