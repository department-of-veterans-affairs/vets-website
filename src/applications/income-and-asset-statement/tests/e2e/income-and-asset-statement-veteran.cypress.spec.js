import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import {
  fillDateWebComponentPattern,
  fillStandardTextInput,
  fillTextWebComponent,
  selectRadioWebComponent,
  selectYesNoWebComponent,
} from './helpers';

import mockUser from '../fixtures/mocks/user.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

Cypress.config('waitForAnimations', true);

const SUBMISSION_DATE = new Date().toISOString();
const SUBMISSION_CONFIRMATION_NUMBER = '01e77e8d-79bf-4991-a899-4e2defff11e0';

let addedUnassociatedIncomeItem = false;
let addedAssociatedIncomeItem = false;
let addedOwnedAssetItem = false;
let addedRoyaltiesItem = false;
let addedAssetTransferItem = false;
let addedTrustItem = false;
let addedAnnuityItem = false;
let addedUnreportedAssetItem = false;
let addedDiscontinuedIncomeItem = false;
let addedIncomeReceiptWaiverItem = false;

const mockPrefill = {
  formData: {
    veteranSsnLastFour: '7821',
    veteranVaFileNumberLastFour: '7821',
  },
  metadata: {
    version: 0,
    prefill: true,
    returnUrl: '/form/21P-0969',
  },
};

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    appName: '21P-0969 Income and Asset Statement Form',
    dataPrefix: 'data',
    dataSets: ['test-data-veteran'],
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.clickStartForm();
        });
      },
      'claimant/reporting-period': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { incomeNetWorthDateRange } = data;
            fillDateWebComponentPattern(
              'incomeNetWorthDateRange_from',
              incomeNetWorthDateRange.from,
            );
            fillDateWebComponentPattern(
              'incomeNetWorthDateRange_to',
              incomeNetWorthDateRange.to,
            );
            cy.clickFormContinue();
          });
        });
      },
      'recurring-income-summary': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            let isAddingUnassociatedIncomes =
              data['view:isAddingUnassociatedIncomes'];
            if (addedUnassociatedIncomeItem) {
              isAddingUnassociatedIncomes = false;
              addedUnassociatedIncomeItem = false;
            }

            selectYesNoWebComponent(
              'view:isAddingUnassociatedIncomes',
              isAddingUnassociatedIncomes,
            );

            cy.clickFormContinue();
          });
        });
      },
      'recurring-income/:index/income-type': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { unassociatedIncomes } = data;
            const {
              incomeType,
              grossMonthlyIncome,
              payer,
            } = unassociatedIncomes[0];

            selectRadioWebComponent('incomeType', incomeType);
            fillStandardTextInput('grossMonthlyIncome', grossMonthlyIncome);
            fillTextWebComponent('payer', payer);

            addedUnassociatedIncomeItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'recurring-income/:index/income-recipient': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { unassociatedIncomes } = data;
            const { recipientRelationship } = unassociatedIncomes[0];

            selectRadioWebComponent(
              'recipientRelationship',
              recipientRelationship,
            );

            cy.clickFormContinue();
          });
        });
      },
      'financial-accounts-summary': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            let isAddingAssociatedIncomes =
              data['view:isAddingAssociatedIncomes'];
            if (addedAssociatedIncomeItem) {
              isAddingAssociatedIncomes = false;
              addedAssociatedIncomeItem = false;
            }

            selectYesNoWebComponent(
              'view:isAddingAssociatedIncomes',
              isAddingAssociatedIncomes,
            );

            cy.clickFormContinue();
          });
        });
      },
      'financial-accounts/:index/income-type': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { associatedIncomes } = data;
            const {
              incomeType,
              grossMonthlyIncome,
              accountValue,
              payer,
            } = associatedIncomes[0];

            selectRadioWebComponent('incomeType', incomeType);
            fillStandardTextInput('grossMonthlyIncome', grossMonthlyIncome);
            fillStandardTextInput('accountValue', accountValue);
            fillTextWebComponent('payer', payer);

            addedAssociatedIncomeItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'financial-accounts/:index/income-recipient': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { associatedIncomes } = data;
            const { recipientRelationship } = associatedIncomes[0];

            selectRadioWebComponent(
              'recipientRelationship',
              recipientRelationship,
            );

            cy.clickFormContinue();
          });
        });
      },
      'property-and-business-summary': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            let isAddingOwnedAssets = data['view:isAddingOwnedAssets'];
            if (addedOwnedAssetItem) {
              isAddingOwnedAssets = false;
              addedOwnedAssetItem = false;
            }

            selectYesNoWebComponent(
              'view:isAddingOwnedAssets',
              isAddingOwnedAssets,
            );

            cy.clickFormContinue();
          });
        });
      },
      'property-and-business/:index/income-type': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { ownedAssets } = data;
            const {
              assetType,
              grossMonthlyIncome,
              ownedPortionValue,
            } = ownedAssets[0];

            selectRadioWebComponent('assetType', assetType);
            fillStandardTextInput('grossMonthlyIncome', grossMonthlyIncome);
            fillStandardTextInput('ownedPortionValue', ownedPortionValue);

            addedOwnedAssetItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'property-and-business/:index/income-recipient': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { ownedAssets } = data;
            const { recipientRelationship } = ownedAssets[0];

            selectRadioWebComponent(
              'recipientRelationship',
              recipientRelationship,
            );

            cy.clickFormContinue();
          });
        });
      },
      'royalties-summary': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            let isAddingRoyalties = data['view:isAddingRoyalties'];
            if (addedRoyaltiesItem) {
              isAddingRoyalties = false;
              addedRoyaltiesItem = false;
            }

            selectYesNoWebComponent(
              'view:isAddingRoyalties',
              isAddingRoyalties,
            );

            cy.clickFormContinue();
          });
        });
      },
      'royalties/:index/income-type': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { royaltiesAndOtherProperties } = data;
            const {
              incomeGenerationMethod,
              grossMonthlyIncome,
              fairMarketValue,
              canBeSold,
            } = royaltiesAndOtherProperties[0];

            selectRadioWebComponent(
              'incomeGenerationMethod',
              incomeGenerationMethod,
            );
            fillStandardTextInput('grossMonthlyIncome', grossMonthlyIncome);
            fillStandardTextInput('fairMarketValue', fairMarketValue);
            selectYesNoWebComponent('canBeSold', canBeSold);

            addedRoyaltiesItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'royalties/:index/income-recipient': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { royaltiesAndOtherProperties } = data;
            const { recipientRelationship } = royaltiesAndOtherProperties[0];

            selectRadioWebComponent(
              'recipientRelationship',
              recipientRelationship,
            );

            cy.clickFormContinue();
          });
        });
      },
      'asset-transfers-summary': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            let isAddingAssetTransfers = data['view:isAddingAssetTransfers'];
            if (addedAssetTransferItem) {
              isAddingAssetTransfers = false;
              addedAssetTransferItem = false;
            }

            selectYesNoWebComponent(
              'view:isAddingAssetTransfers',
              isAddingAssetTransfers,
            );

            cy.clickFormContinue();
          });
        });
      },
      'asset-transfers/:index/relationship': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { assetTransfers } = data;
            const { originalOwnerRelationship } = assetTransfers[0];

            selectRadioWebComponent(
              'originalOwnerRelationship',
              originalOwnerRelationship,
            );

            cy.clickFormContinue();
          });
        });
      },
      'asset-transfers/:index/type': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { assetTransfers } = data;
            const { transferMethod, assetType } = assetTransfers[0];

            selectRadioWebComponent('transferMethod', transferMethod);
            fillStandardTextInput('assetType', assetType);

            cy.clickFormContinue();
          });
        });
      },
      'asset-transfers/:index/new-owner': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { assetTransfers } = data;
            const {
              newOwnerName,
              newOwnerRelationship,
              saleReportedToIrs,
            } = assetTransfers[0];
            const { first, middle, last } = newOwnerName;

            fillTextWebComponent('newOwnerName_first', first);
            fillTextWebComponent('newOwnerName_middle', middle);
            fillTextWebComponent('newOwnerName_last', last);
            fillTextWebComponent('newOwnerRelationship', newOwnerRelationship);
            selectYesNoWebComponent('saleReportedToIrs', saleReportedToIrs);

            cy.clickFormContinue();
          });
        });
      },
      'asset-transfers/:index/transfer-date': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { assetTransfers } = data;
            const { transferDate } = assetTransfers[0];

            fillDateWebComponentPattern('transferDate', transferDate);

            cy.clickFormContinue();
          });
        });
      },
      'asset-transfers/:index/fair-value': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { assetTransfers } = data;
            const { assetTransferredUnderFairMarketValue } = assetTransfers[0];

            selectYesNoWebComponent(
              'assetTransferredUnderFairMarketValue',
              assetTransferredUnderFairMarketValue,
            );

            cy.clickFormContinue();
          });
        });
      },
      'asset-transfers/:index/market-value': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { assetTransfers } = data;
            const {
              fairMarketValue,
              saleValue,
              capitalGainValue,
            } = assetTransfers[0];

            fillStandardTextInput('fairMarketValue', fairMarketValue);
            fillStandardTextInput('saleValue', saleValue);
            fillStandardTextInput('capitalGainValue', capitalGainValue);

            addedAssetTransferItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'trusts-summary': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            let isAddingTrusts = data['view:isAddingTrusts'];
            if (addedTrustItem) {
              isAddingTrusts = false;
              addedTrustItem = false;
            }

            selectYesNoWebComponent('view:isAddingTrusts', isAddingTrusts);

            cy.clickFormContinue();
          });
        });
      },
      'trusts/:index/trust-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { trusts } = data;
            const { establishedDate, marketValueAtEstablishment } = trusts[0];

            fillDateWebComponentPattern('establishedDate', establishedDate);
            fillStandardTextInput(
              'marketValueAtEstablishment',
              marketValueAtEstablishment,
            );

            addedTrustItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'trusts/:index/trust-type': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { trusts } = data;
            const { trustType } = trusts[0];

            selectRadioWebComponent('trustType', trustType);

            addedTrustItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'trusts/:index/trust-income': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { trusts } = data;
            const {
              receivingIncomeFromTrust,
              annualReceivedIncome,
            } = trusts[0];

            selectYesNoWebComponent(
              'receivingIncomeFromTrust',
              receivingIncomeFromTrust,
            );
            fillStandardTextInput('annualReceivedIncome', annualReceivedIncome);

            addedTrustItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'trusts/:index/trust-medical-expenses': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { trusts } = data;
            const {
              trustUsedForMedicalExpenses,
              monthlyMedicalReimbursementAmount,
            } = trusts[0];

            selectYesNoWebComponent(
              'trustUsedForMedicalExpenses',
              trustUsedForMedicalExpenses,
            );
            fillStandardTextInput(
              'monthlyMedicalReimbursementAmount',
              monthlyMedicalReimbursementAmount,
            );

            addedTrustItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'trusts/:index/trust-veterans-child': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { trusts } = data;
            const { trustEstablishedForVeteransChild } = trusts[0];

            selectYesNoWebComponent(
              'trustEstablishedForVeteransChild',
              trustEstablishedForVeteransChild,
            );

            addedTrustItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'trusts/:index/trust-control': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { trusts } = data;
            const { haveAuthorityOrControlOfTrust } = trusts[0];

            selectYesNoWebComponent(
              'haveAuthorityOrControlOfTrust',
              haveAuthorityOrControlOfTrust,
            );

            addedTrustItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'trusts/:index/has-added-funds': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { trusts } = data;
            const { addedFundsAfterEstablishment } = trusts[0];

            selectYesNoWebComponent(
              'addedFundsAfterEstablishment',
              addedFundsAfterEstablishment,
            );

            addedTrustItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'trusts/:index/added-funds': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { trusts } = data;
            const { addedFundsDate, addedFundsAmount } = trusts[0];

            fillDateWebComponentPattern('addedFundsDate', addedFundsDate);
            fillStandardTextInput('addedFundsAmount', addedFundsAmount);

            addedTrustItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'annuities-summary': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            let isAddingAnnuities = data['view:isAddingAnnuities'];
            if (addedAnnuityItem) {
              isAddingAnnuities = false;
              addedAnnuityItem = false;
            }

            selectYesNoWebComponent(
              'view:isAddingAnnuities',
              isAddingAnnuities,
            );

            cy.clickFormContinue();
          });
        });
      },
      'annuities/:index/information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { annuities } = data;
            const {
              establishedDate,
              marketValueAtEstablishment,
            } = annuities[0];

            fillDateWebComponentPattern('establishedDate', establishedDate);
            fillStandardTextInput(
              'marketValueAtEstablishment',
              marketValueAtEstablishment,
            );

            addedAnnuityItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'annuities/:index/revocable': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { annuities } = data;
            const { revocable } = annuities[0];

            selectYesNoWebComponent('revocable', revocable);

            addedAnnuityItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'annuities/:index/income': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { annuities } = data;
            const {
              receivingIncomeFromAnnuity,
              annualReceivedIncome,
            } = annuities[0];

            selectYesNoWebComponent(
              'receivingIncomeFromAnnuity',
              receivingIncomeFromAnnuity,
            );
            fillStandardTextInput('annualReceivedIncome', annualReceivedIncome);

            addedAnnuityItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'annuities/:index/liquidation': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { annuities } = data;
            const { canBeLiquidated, surrenderValue } = annuities[0];

            selectYesNoWebComponent('canBeLiquidated', canBeLiquidated);
            fillStandardTextInput('surrenderValue', surrenderValue);

            addedAnnuityItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'annuities/:index/has-added-funds': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { annuities } = data;
            const { addedFundsAfterEstablishment } = annuities[0];

            selectYesNoWebComponent(
              'addedFundsAfterEstablishment',
              addedFundsAfterEstablishment,
            );

            addedAnnuityItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'annuities/:index/added-funds': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { annuities } = data;
            const { addedFundsDate, addedFundsAmount } = annuities[0];

            fillDateWebComponentPattern('addedFundsDate', addedFundsDate);
            fillStandardTextInput('addedFundsAmount', addedFundsAmount);

            addedAnnuityItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'unreported-assets-summary': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            let isAddingUnreportedAssets =
              data['view:isAddingUnreportedAssets'];
            if (addedUnreportedAssetItem) {
              isAddingUnreportedAssets = false;
              addedUnreportedAssetItem = false;
            }

            selectYesNoWebComponent(
              'view:isAddingUnreportedAssets',
              isAddingUnreportedAssets,
            );

            cy.clickFormContinue();
          });
        });
      },
      'unreported-assets/:index/relationship': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { unreportedAssets } = data;
            const { assetOwnerRelationship } = unreportedAssets[0];

            selectRadioWebComponent(
              'assetOwnerRelationship',
              assetOwnerRelationship,
            );

            addedUnreportedAssetItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'unreported-assets/:index/asset-type': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { unreportedAssets } = data;
            const {
              assetType,
              ownedPortionValue,
              assetLocation,
            } = unreportedAssets[0];

            fillStandardTextInput('assetType', assetType);
            fillStandardTextInput('ownedPortionValue', ownedPortionValue);
            fillStandardTextInput('assetLocation', assetLocation);

            addedUnreportedAssetItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'discontinued-incomes-summary': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            let isAddingDiscontinuedIncomes =
              data['view:isAddingDiscontinuedIncomes'];
            if (addedDiscontinuedIncomeItem) {
              isAddingDiscontinuedIncomes = false;
              addedDiscontinuedIncomeItem = false;
            }

            selectYesNoWebComponent(
              'view:isAddingDiscontinuedIncomes',
              isAddingDiscontinuedIncomes,
            );

            cy.clickFormContinue();
          });
        });
      },
      'discontinued-incomes/:index/relationship': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { discontinuedIncomes } = data;
            const { recipientRelationship } = discontinuedIncomes[0];

            selectRadioWebComponent(
              'recipientRelationship',
              recipientRelationship,
            );

            addedDiscontinuedIncomeItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'discontinued-incomes/:index/payer': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { discontinuedIncomes } = data;
            const { payer } = discontinuedIncomes[0];

            fillStandardTextInput('payer', payer);

            addedDiscontinuedIncomeItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'discontinued-incomes/:index/type': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { discontinuedIncomes } = data;
            const { incomeType } = discontinuedIncomes[0];

            fillStandardTextInput('incomeType', incomeType);

            addedDiscontinuedIncomeItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'discontinued-incomes/:index/frequency': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { discontinuedIncomes } = data;
            const { incomeFrequency } = discontinuedIncomes[0];

            selectRadioWebComponent('incomeFrequency', incomeFrequency);

            addedDiscontinuedIncomeItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'discontinued-incomes/:index/date': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { discontinuedIncomes } = data;
            const { incomeLastReceivedDate } = discontinuedIncomes[0];

            fillDateWebComponentPattern(
              'incomeLastReceivedDate',
              incomeLastReceivedDate,
            );

            addedDiscontinuedIncomeItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'discontinued-incomes/:index/amount': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { discontinuedIncomes } = data;
            const { grossAnnualAmount } = discontinuedIncomes[0];

            fillStandardTextInput('grossAnnualAmount', grossAnnualAmount);

            addedDiscontinuedIncomeItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'waived-income-summary': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            let isAddingIncomeReceiptWaivers =
              data['view:isAddingIncomeReceiptWaivers'];
            if (addedIncomeReceiptWaiverItem) {
              isAddingIncomeReceiptWaivers = false;
              addedIncomeReceiptWaiverItem = false;
            }

            selectYesNoWebComponent(
              'view:isAddingIncomeReceiptWaivers',
              isAddingIncomeReceiptWaivers,
            );

            cy.clickFormContinue();
          });
        });
      },
      'waived-income/:index/relationship': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { incomeReceiptWaivers } = data;
            const { recipientRelationship } = incomeReceiptWaivers[0];
            selectRadioWebComponent(
              'recipientRelationship',
              recipientRelationship,
            );

            addedIncomeReceiptWaiverItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'waived-income/:index/payer': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { incomeReceiptWaivers } = data;
            const { payer } = incomeReceiptWaivers[0];
            fillStandardTextInput('payer', payer);

            addedIncomeReceiptWaiverItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'waived-income/:index/gross-amount': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { incomeReceiptWaivers } = data;
            const { waivedGrossMonthlyIncome } = incomeReceiptWaivers[0];
            fillStandardTextInput(
              'waivedGrossMonthlyIncome',
              waivedGrossMonthlyIncome,
            );

            addedIncomeReceiptWaiverItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'waived-income/:index/payments': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(() => {
            selectYesNoWebComponent('view:paymentsWillResume', false);

            addedIncomeReceiptWaiverItem = true;

            cy.clickFormContinue();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(() => {
            // Target the va-privacy-agreement component
            cy.get('va-privacy-agreement[name="statementOfTruthCertified"]')
              .shadow()
              .find('input[type="checkbox"]')
              .click({ force: true });

            cy.clickFormContinue(); // Submit
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', {
        data: {
          features: [
            {
              name: 'income_and_assets_form_enabled',
              value: true,
            },
            {
              name: 'income_and_assets_browser_monitoring_enabled',
              value: true,
            },
          ],
        },
      });
      cy.intercept('GET', '/v0/user', mockUser);
      cy.get('@testData').then(testData => {
        const data = {
          metadata: mockPrefill,
          formData: testData,
        };

        cy.intercept('GET', '/v0/in_progress_forms/21P-0969', data);
        cy.intercept('PUT', '/v0/in_progress_forms/21P-0969', data);
      });
      cy.intercept('POST', `income_and_assets/v0/${formConfig.submitUrl}`, {
        data: {
          id: 'mock-id',
          type: 'saved_income_and_asset_claim',
          attributes: {
            submittedAt: SUBMISSION_DATE,
            regionalOffice: [
              'Attention:  Philadelphia Pension Center',
              'P.O. Box 5206',
              'Janesville, WI 53547-5206',
            ],
            confirmationNumber: SUBMISSION_CONFIRMATION_NUMBER,
            guid: '01e77e8d-79bf-4991-a899-4e2defff11e0',
            form: '21P-0969',
          },
        },
      }).as('submitApplication');

      cy.login(mockUser);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
