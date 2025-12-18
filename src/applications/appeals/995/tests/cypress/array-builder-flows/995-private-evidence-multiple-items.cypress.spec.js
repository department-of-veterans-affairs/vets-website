import manifest from '../../../manifest.json';
import cypressSetup from '../../../../shared/tests/cypress.setup';
import * as h from '../helpers';
import { EVIDENCE_URLS } from '../../../constants';
import mockData from '../../fixtures/data/pre-api-comprehensive-test.json';
import { CONTESTABLE_ISSUES_API } from '../../../constants/apis';
import {
  detailsEntryContent,
  promptContent,
  summaryContent,
  treatmentDateContent,
} from '../../../content/evidence/private';
import { issuesContent } from '../../../pages/evidence/common';

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
      h.verifyFPSH3(
        'Do you want us to get your private (non-VA) provider or VA Vet Center medical records?',
      );
      h.verifyFPSDesc(
        'You have private provider or VA Vet Center medical records if you were treated by a:',
      );
      h.checkErrorHandlingWithClass(
        '[name="root_hasPrivateEvidence"]',
        promptContent.requiredError,
      );

      h.selectPrivatePromptResponse('Y');

      // 4142 Auth
      h.check4142Auth();

      // Location
      h.verifyH3(
        'What location should we request your private provider or VA Vet Center records from?',
      );

      // Check error handling
      h.clickContinue();
      h.checkError(
        '[name="root_treatmentLocation"]',
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
        '[name="root_issuesPrivate"]',
        issuesContent.requiredError,
      );
      cy.get('[name="root_issuesPrivate_Hypertension"]')
        .eq(0)
        .click();
      cy.get('[name="root_issuesPrivate_Tendonitis, left ankle"]')
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
      h.verifyArrayBuilderReviewPrivateCard(
        0,
        'Johns Hopkins Hospital',
        `Review the evidence you’re submitting`,
        `Private providers or VA Vet Centers we’ll request your records from`,
        2,
        'Hypertension; and Tendonitis, left ankle',
        'March 1, 2020 to Nov. 18, 2020',
      );

      // ---------------------------------------- SECOND ITEM
      h.checkErrorHandlingWithClass(
        '[name="root_hasPrivateEvidence"]',
        summaryContent.requiredError,
      );
      h.selectPrivatePromptResponse('Y');

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
      cy.get('[name="root_issuesPrivate_Sleep apnea"]')
        .eq(0)
        .click();
      cy.get('[name="root_issuesPrivate_Headaches"]')
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
        `Review the evidence you’re submitting`,
        `Private providers or VA Vet Centers we’ll request your records from`,
        2,
        'Headaches and Sleep apnea',
        'July 16, 1980 to Jan. 3, 2001',
      );

      // ---------------------------------------- THIRD ITEM
      h.selectPrivatePromptResponse('Y');

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
      cy.get('[name="root_issuesPrivate_Sleep apnea"]')
        .eq(0)
        .click();
      cy.get('[name="root_issuesPrivate_Headaches"]')
        .eq(0)
        .click();

      cy.get('[name="root_issuesPrivate_Hypertension"]')
        .eq(0)
        .click();
      cy.get('[name="root_issuesPrivate_Tendonitis, left ankle"]')
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
        `Review the evidence you’re submitting`,
        `Private providers or VA Vet Centers we’ll request your records from`,
        4,
        'Headaches; Hypertension; Tendonitis, left ankle; and Sleep apnea',
        'Oct. 4, 1999 to Oct. 4, 1999',
      );

      h.selectPrivatePromptResponse('N');
      cy.url().should(
        'contain',
        `${manifest.rootUrl}/${EVIDENCE_URLS.uploadPrompt}`,
      );
    });
  });
});
