import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mock-user.json';
import mockPrefill from './fixtures/mocks/mock-prefill-with-v2-prefill-data.json';
import featureToggles from './fixtures/mocks/mock-features.json';
import { goToNextPage } from './helpers';
import {
  MOCK_ENROLLMENT_RESPONSE,
  LAST_YEAR,
  API_ENDPOINTS,
} from '../../utils/constants';
import { advanceToHouseholdSection } from './helpers/household';
import maxTestData from './fixtures/data/maximal-test.json';
import {
  fillVeteranIncome,
  fillSpousalIncome,
  fillDeductibleExpenses,
} from './utils/fillers';
import { handleOptionalServiceHistoryPage } from './helpers/handleOptionalServiceHistoryPage';

// Add the feature toggle for the providers and dependents prefill
featureToggles.data.features.push({
  name: 'ezrFormPrefillWithProvidersAndDependents',
  value: true,
});
featureToggles.data.features.push({
  name: 'ezrSpouseConfirmationFlowEnabled',
  value: false,
});

const { data } = maxTestData;

function advanceToFinancialIntroductionPage(hasSpouse) {
  goToNextPage('/household-information/marital-status');
  if (!hasSpouse) {
    cy.selectVaSelect('root_view:maritalStatus_maritalStatus', 'Never Married');
  }
  cy.injectAxeThenAxeCheck();
  if (hasSpouse) {
    goToNextPage('/household-information/spouse-personal-information');
    cy.injectAxeThenAxeCheck();
    goToNextPage('/household-information/spouse-additional-information');
    cy.selectRadio('root_cohabitedLastYear', 'Y');
    cy.selectRadio('root_sameAddress', 'Y');
    cy.injectAxeThenAxeCheck();
  }
  goToNextPage('/household-information/dependents');
  cy.selectRadio('root_view:reportDependents', 'N');
  cy.injectAxeThenAxeCheck();
  goToNextPage('/household-information/financial-information-overview');
  cy.injectAxeThenAxeCheck();
  goToNextPage('/household-information/financial-information');
  cy.injectAxeThenAxeCheck();
}

function setUserDataAndAdvanceToHouseholdSection(user, prefillData) {
  cy.login(user);
  cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
    'mockFeatures',
  );
  cy.intercept('GET', `/v0${API_ENDPOINTS.enrollmentStatus}*`, {
    statusCode: 200,
    body: MOCK_ENROLLMENT_RESPONSE,
  }).as('mockEnrollmentStatus');
  cy.intercept('/v0/in_progress_forms/10-10EZR', {
    statusCode: 200,
    body: prefillData,
  }).as('mockSip');
  cy.visit(manifest.rootUrl);
  cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);
  advanceToHouseholdSection();
  handleOptionalServiceHistoryPage({
    historyEnabled: data['view:ezrServiceHistoryEnabled'],
    hasServiceHistoryInfo: !data['view:hasPrefillServiceHistory'],
  });
  cy.injectAxeThenAxeCheck();
}

function advanceToVeteranAnnualIncomePage(hasSpouse) {
  advanceToFinancialIntroductionPage(hasSpouse);
  cy.selectRadio('root_view:hasFinancialInformationToAdd', 'Y');
  goToNextPage('/veteran-annual-income');
}

function fillFinancialInformation(
  hasSpouse,
  financialData,
  isArrayBuilderEditPage = false,
  clearInput = false,
) {
  fillVeteranIncome(financialData, clearInput);
  cy.injectAxeThenAxeCheck();
  if (hasSpouse) {
    goToNextPage('/spouse-annual-income', isArrayBuilderEditPage);
    fillSpousalIncome(financialData, clearInput);
    cy.injectAxeThenAxeCheck();
  }
  goToNextPage('/deductible-expenses', isArrayBuilderEditPage);
  fillDeductibleExpenses(financialData, clearInput);
  cy.injectAxeThenAxeCheck();
  goToNextPage(
    '/household-information/financial-information',
    isArrayBuilderEditPage,
  );
}

describe('EZR V2 financial information flow', () => {
  beforeEach(() => {
    setUserDataAndAdvanceToHouseholdSection(mockUser, mockPrefill);
  });

  context('when the user has no financial information to report', () => {
    it('should not show financial information questions', () => {
      advanceToFinancialIntroductionPage(false);
      cy.selectRadio('root_view:hasFinancialInformationToAdd', 'N');
      cy.injectAxeThenAxeCheck();
      // The user should be redirected to the insurance section
      goToNextPage('/insurance-information/medicaid-eligibility');
    });
  });

  context('when the user has financial information to report', () => {
    context('when the user has a spouse', () => {
      it('should successfully fill veteran annual income, spouse annual income, and deductible expenses', () => {
        advanceToVeteranAnnualIncomePage(true);
        fillFinancialInformation(true, data);
        // All three sets of financial information should be present on the review page
        cy.get('va-card')
          .find('h4')
          .should('have.length', 3);
        cy.get('va-card')
          .find('h4')
          .first()
          .should('contain', `Your annual income from ${LAST_YEAR}`);
        cy.get('va-card')
          .find('h4')
          .eq(1)
          .should('contain', `Spouse’s annual income from ${LAST_YEAR}`);
        cy.get('va-card')
          .find('h4')
          .last()
          .should('contain', `Deductible expenses from ${LAST_YEAR}`);
        cy.injectAxeThenAxeCheck();
      });

      context('when the user does not have a spouse', () => {
        it('should successfully fill veteran annual income and deductible expenses, but not render the spouse annual income page', () => {
          advanceToVeteranAnnualIncomePage(false);
          fillFinancialInformation(false, data);
          cy.get('va-card')
            .find('h4')
            .should('have.length', 2);
          cy.get('va-card')
            .find('h4')
            .first()
            .should('contain', `Your annual income from ${LAST_YEAR}`);
          cy.get('va-card')
            .find('h4')
            .last()
            .should('contain', `Deductible expenses from ${LAST_YEAR}`);
          cy.injectAxeThenAxeCheck();
        });
      });
    });
    // TODO: Fix this spec. This feature currently isn't enabled in production,
    // so it's okay to disable for the Node 22 bug bash
    xit('should allow the user to edit existing financial information', () => {
      const updatedData = {
        'view:veteranGrossIncome': {
          veteranGrossIncome: 5,
        },
        'view:veteranNetIncome': {
          veteranNetIncome: 3,
        },
        'view:veteranOtherIncome': {
          veteranOtherIncome: 12,
        },
        'view:spouseGrossIncome': {
          spouseGrossIncome: 5,
        },
        'view:spouseNetIncome': {
          spouseNetIncome: 33,
        },
        'view:spouseOtherIncome': {
          spouseOtherIncome: 3,
        },
        'view:deductibleMedicalExpenses': {
          deductibleMedicalExpenses: 4,
        },
        'view:deductibleFuneralExpenses': {
          deductibleFuneralExpenses: 65,
        },
        'view:deductibleEducationExpenses': {
          deductibleEducationExpenses: 47,
        },
      };

      advanceToVeteranAnnualIncomePage(true);
      fillFinancialInformation(true, data);
      cy.findAllByRole('link', {
        name: /edit/i,
      })
        .first()
        .click();
      // There should be no delete button
      cy.findAllByRole('button', {
        name: /delete/i,
      }).should('not.exist');
      fillFinancialInformation(true, updatedData, true, true);
      cy.injectAxeThenAxeCheck();
    });
  });
});
