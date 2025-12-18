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
      h.verifyFPSH3(
        'Do you want us to get your private (non-VA) provider or VA Vet Center medical records?',
      );
      h.verifyFPSDesc(
        'You have private provider or VA Vet Center medical records if you were treated by a:',
      );
      h.selectPrivatePromptResponse('Y');

      // 4142 Auth
      h.check4142Auth();

      // Location
      h.verifyH3(
        'What location should we request your private provider or VA Vet Center records from?',
      );
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
      cy.get('[name="root_issuesPrivate_Hypertension"]')
        .eq(0)
        .click();
      cy.get('[name="root_issuesPrivate_Tendonitis, left ankle"]')
        .eq(0)
        .click();

      h.clickContinue();

      // Treatment Dates
      h.verifyH3('When were you treated at Johns Hopkins Hospital?');
      h.addPrivateTreatmentDates('2020-03-01', '2020-07-18');
    });
  });
});
