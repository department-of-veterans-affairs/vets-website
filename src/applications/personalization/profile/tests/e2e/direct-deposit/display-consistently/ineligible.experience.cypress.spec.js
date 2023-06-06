import DirectDeposit from '../DirectDeposit';
import { noAccount } from '../../../../mocks/endpoints/bank-accounts';
import { loa3User72 } from '../../../../mocks/endpoints/user';

import { generateFeatureToggles } from '../../../../mocks/endpoints/feature-toggles';

const notEligible = {
  data: {
    id: '',
    type: 'evss_ppiu_payment_information_responses',
    attributes: {
      responses: [
        {
          controlInformation: {
            canUpdateAddress: true,
            corpAvailIndicator: true,
            corpRecFoundIndicator: true,
            hasNoBdnPaymentsIndicator: true,
            identityIndicator: true,
            isCompetentIndicator: true,
            indexIndicator: true,
            noFiduciaryAssignedIndicator: true,
            notDeceasedIndicator: true,
          },
          paymentAccount: {
            accountType: null,
            financialInstitutionName: null,
            accountNumber: null,
            financialInstitutionRoutingNumber: null,
          },
          paymentAddress: {
            type: null,
            addressEffectiveDate: null,
            addressOne: null,
            addressTwo: null,
            addressThree: null,
            city: null,
            stateCode: null,
            zipCode: null,
            zipSuffix: null,
            countryName: null,
            militaryPostOfficeTypeCode: null,
            militaryStateCode: null,
          },
          paymentType: 'CNP',
        },
      ],
    },
  },
};

describe('Direct Deposit Consistently', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles());
  });

  it('should display the ineligible message', () => {
    cy.login(loa3User72);
    cy.intercept('GET', 'v0/ppiu/payment_information', notEligible);
    cy.intercept('GET', '/v0/profile/ch33_bank_accounts', noAccount);

    DirectDeposit.visitPage();
    cy.injectAxeThenAxeCheck();
    DirectDeposit.confirmIneligibleMessageIsDisplayedForCNP();
    DirectDeposit.confirmIneligibleMessageIsDisplayedForEducation();
  });
});
